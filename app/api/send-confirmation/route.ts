import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, fullName, orderId } = body;

  const html = `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
      
      <div style="background: #000000; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 28px; letter-spacing: 8px; margin: 0; font-weight: 300;">VYRA</h1>
      </div>

      <div style="padding: 32px; text-align: center;">
        <h2 style="font-size: 20px; color: #111111; margin: 0 0 12px;">Order Confirmed ✓</h2>
        <p style="color: #555555; font-size: 15px; margin: 0 0 8px;">Hey ${fullName}, thanks for your order!</p>
        <p style="color: #555555; font-size: 15px; margin: 0 0 24px;">Your order <strong>#${orderId}</strong> is being processed and will be shipped within 2–5 business days.</p>
        <p style="color: #888888; font-size: 13px; margin: 0;">Questions? Email us at <a href="mailto:vyrastore07@gmail.com" style="color: #111111;">vyrastore07@gmail.com</a></p>
      </div>

      <div style="padding: 16px 32px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="font-size: 11px; color: #cccccc; letter-spacing: 2px; margin: 0;">© 2025 VYRA. ALL RIGHTS RESERVED.</p>
      </div>

    </div>
  `;

  try {
    await resend.emails.send({
      from: "VYRA Store <onboarding@resend.dev>",
      to: email,
      subject: `Order Confirmed — #${orderId} | VYRA`,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}