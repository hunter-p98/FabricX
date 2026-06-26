import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, fullName, items, total, orderId, address } = body;

  const itemsHtml = items
    .map(
      (item: {
        name: string;
        size?: string;
        color?: string;
        quantity: number;
        price: number;
      }) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <strong>${item.name}</strong><br/>
          <span style="color:#888; font-size:12px;">
            ${item.size ? `Size: ${item.size}` : ""}
            ${item.size && item.color ? " · " : ""}
            ${item.color ? `Color: ${item.color}` : ""}
          </span>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; text-align:right;">
          ${item.quantity} × $${item.price.toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: #000000; padding: 40px 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 32px; letter-spacing: 8px; margin: 0; font-weight: 300;">VYRA</h1>
        <p style="color: #aaaaaa; font-size: 12px; letter-spacing: 3px; margin: 8px 0 0;">STORE</p>
      </div>
      <div style="background: #f9f9f9; padding: 32px; text-align: center; border-bottom: 1px solid #eeeeee;">
        <h2 style="margin: 0 0 8px; font-size: 22px; color: #111111;">Thank you, ${fullName}! 🎉</h2>
        <p style="margin: 0; color: #666666; font-size: 15px;">Your order has been confirmed and is being processed.</p>
      </div>
      <div style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
        <p style="margin: 0; font-size: 13px; color: #999999; letter-spacing: 1px; text-transform: uppercase;">Order Reference</p>
        <p style="margin: 6px 0 0; font-size: 20px; font-weight: bold; color: #111111; letter-spacing: 2px;">#${orderId}</p>
      </div>
      <div style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
        <p style="margin: 0 0 16px; font-size: 13px; color: #999999; letter-spacing: 1px; text-transform: uppercase;">Items Ordered</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333333;">
          ${itemsHtml}
        </table>
        <div style="margin-top: 16px; text-align: right;">
          <span style="font-size: 16px; font-weight: bold; color: #111111;">Total: $${total}</span>
        </div>
      </div>
      <div style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #999999; letter-spacing: 1px; text-transform: uppercase;">Shipping To</p>
        <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.7;">
          ${fullName}<br/>
          ${address.line1}<br/>
          ${address.line2 ? address.line2 + "<br/>" : ""}
          ${address.city}, ${address.postalCode}<br/>
          ${address.country}
        </p>
      </div>
      <div style="padding: 24px 32px; border-bottom: 1px solid #eeeeee; background: #fafafa;">
        <p style="margin: 0 0 12px; font-size: 13px; color: #999999; letter-spacing: 1px; text-transform: uppercase;">What Happens Next?</p>
        <p style="margin: 0; font-size: 14px; color: #444444;">📦 <strong>Processing</strong> — We're preparing your order with our print partner.</p>
        <p style="margin: 8px 0 0; font-size: 14px; color: #444444;">🚚 <strong>Shipping</strong> — You'll receive a tracking link once dispatched.</p>
        <p style="margin: 8px 0 0; font-size: 14px; color: #444444;">✅ <strong>Delivery</strong> — Estimated 7–14 business days.</p>
      </div>
      <div style="padding: 24px 32px; text-align: center;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #999999;">Questions? Contact us at</p>
        <a href="mailto:vyrastore07@gmail.com" style="color: #111111; font-weight: bold; font-size: 13px;">vyrastore07@gmail.com</a>
        <p style="margin: 24px 0 0; font-size: 11px; color: #cccccc; letter-spacing: 2px;">© 2025 VYRA. ALL RIGHTS RESERVED.</p>
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