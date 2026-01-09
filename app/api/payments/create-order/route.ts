import { NextRequest, NextResponse } from "next/server";
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
    const { productId, amount } = await request.json();

    if (!productId || !amount) {
      return NextResponse.json(
        { error: "Product ID and amount are required" },
        { status: 400 }
      );
    }

    const options = {
      amount: amount, // amount in paise
      currency: "INR",
      receipt: `receipt_${productId}_${Date.now()}`,
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      { orderId: order.id, amount: order.amount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
