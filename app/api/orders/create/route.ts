import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, totalAmount, customer_name, customer_email, customer_phone, shipping_address } = body;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/orders/create/route.ts:10',message:'Order creation request received',data:{itemsCount:items?.length||0,hasItems:!!items,isArray:Array.isArray(items),totalAmount,hasRazorpayKey:!!process.env.RAZORPAY_KEY_ID},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!items || !Array.isArray(items) || items.length === 0) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/orders/create/route.ts:14',message:'Validation failed: items missing or invalid',data:{hasItems:!!items,isArray:Array.isArray(items),itemsLength:items?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/orders/create/route.ts:21',message:'Validation failed: invalid totalAmount',data:{totalAmount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: "Total amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: totalAmount, // Already in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/orders/create/route.ts:29',message:'Creating Razorpay order',data:{amount:options.amount,currency:options.currency},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    const order = await razorpay.orders.create(options);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/orders/create/route.ts:35',message:'Razorpay order created successfully',data:{orderId:order.id,amount:order.amount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    return NextResponse.json(
      { orderId: order.id, amount: order.amount },
      { status: 200 }
    );
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/orders/create/route.ts:42',message:'Error creating order',data:{error:error instanceof Error?error.message:'Unknown error',errorType:error?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
