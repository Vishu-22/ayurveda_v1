import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

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
