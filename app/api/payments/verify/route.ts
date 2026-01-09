import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import crypto from "crypto";
import Razorpay from "razorpay";

// Lazy initialization function to avoid build-time errors
function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, signature, items, productId, quantity, customer_name, customer_email, customer_phone, shipping_address } = body;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:11',message:'Payment verification request received',data:{hasOrderId:!!orderId,hasPaymentId:!!paymentId,hasSignature:!!signature,itemsCount:items?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    if (!orderId || !paymentId || !signature) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:15',message:'Validation failed: missing required fields',data:{hasOrderId:!!orderId,hasPaymentId:!!paymentId,hasSignature:!!signature},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: "Missing required payment verification data" },
        { status: 400 }
      );
    }

    // Verify signature
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:29',message:'Signature verification',data:{signatureMatch:generatedSignature===signature,hasKeySecret:!!process.env.RAZORPAY_KEY_SECRET},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    if (generatedSignature !== signature) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:31',message:'Signature mismatch - verification failed',data:{generatedSignature:generatedSignature.substring(0,20)+'...',receivedSignature:signature.substring(0,20)+'...'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:52',message:'Fetching payment details from Razorpay',data:{paymentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:54',message:'Payment details fetched',data:{paymentStatus:payment.status,paymentAmount:payment.amount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    if (payment.status === "captured") {
      const supabase = createServerClient();

      // Handle multi-item orders (from cart) or single item orders (buy now)
      const paymentAmount = typeof payment.amount === 'number' ? payment.amount : Number(payment.amount) || 0;
      const itemQuantity = typeof quantity === 'number' ? quantity : Number(quantity) || 1;
      const orderItems = items || (productId ? [{ productId, quantity: itemQuantity, price: paymentAmount / itemQuantity }] : []);

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:58',message:'Preparing to save order to database',data:{orderItemsCount:orderItems.length,paymentAmount:payment.amount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          payment_id: paymentId,
          razorpay_order_id: orderId,
          amount: payment.amount,
          customer_name: customer_name || null,
          customer_email: customer_email || null,
          customer_phone: customer_phone || null,
          shipping_address: shipping_address || null,
          status: "processing",
        })
        .select()
        .single();

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:61',message:'Order insert result',data:{orderCreated:!!order,hasError:!!orderError,errorMessage:orderError?.message,orderId:order?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion

      if (orderError) {
        console.error("Error saving order:", orderError);
        return NextResponse.json(
          { error: "Failed to save order" },
          { status: 500 }
        );
      }

      // Create order items
      if (orderItems.length > 0) {
        const paymentAmount = typeof payment.amount === 'number' ? payment.amount : Number(payment.amount) || 0;
        const orderItemsData = orderItems.map((item: any) => ({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity || 1,
          price_at_purchase: Math.round((item.price || (orderItems.length > 0 ? paymentAmount / orderItems.length : 0)) * 100), // Convert to paise
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItemsData);

        if (itemsError) {
          console.error("Error saving order items:", itemsError);
          // Order is created but items failed - still return success but log error
        }
      }

      // Create Shiprocket order (basic integration)
      try {
        await fetch(`${request.nextUrl.origin}/api/shiprocket/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            items: orderItems,
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
          }),
        });
      } catch (shiprocketError) {
        console.error("Error creating Shiprocket order:", shiprocketError);
        // Don't fail the payment if Shiprocket fails
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/payments/verify/route.ts:137',message:'Payment verification successful, returning success response',data:{orderId:order.id,paymentId:payment.id,success:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion

      return NextResponse.json(
        { success: true, paymentId: payment.id, orderId: order.id },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Payment not captured" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}

