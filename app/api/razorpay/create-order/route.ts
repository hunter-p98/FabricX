import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "USD" } = await req.json();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `vyra_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}