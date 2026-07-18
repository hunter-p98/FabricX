import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const FALLBACK_USD_TO_INR = 83.5;

async function getUsdToInrRate(): Promise<number> {
  const url = process.env.FX_API_URL;
  const apiKey = process.env.FX_API_KEY;

  if (!url) return FALLBACK_USD_TO_INR;

  try {
    const res = await fetch(url, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
      cache: "no-store",
    });
    if (!res.ok) return FALLBACK_USD_TO_INR;

    const data = await res.json();
    const rates = (data.rates ?? data.conversion_rates) as Record<string, number> | undefined;
    const inrRate = rates?.["INR"];

    return typeof inrRate === "number" && inrRate > 0 ? inrRate : FALLBACK_USD_TO_INR;
  } catch {
    return FALLBACK_USD_TO_INR;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const usdToInr = await getUsdToInrRate();
    const amountInInr = amount * usdToInr;
    const amountInPaise = Math.round(amountInInr * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `vyra_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
