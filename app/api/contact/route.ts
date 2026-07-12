import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Save to Supabase FIRST — this is the source of truth, guaranteed to work
    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: String(name).trim(),
      email: trimmedEmail,
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    if (dbError) {
      console.error("Supabase insert error (contact_messages):", dbError);
      return NextResponse.json(
        { success: false, error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // Try to notify the store owner via email — best effort, don't fail the request if this fails
    const { data: ownerData, error: ownerError } = await resend.emails.send({
      from: "VYRA Contact Form <onboarding@resend.dev>",
      to: "vyrastore07@gmail.com",
      replyTo: trimmedEmail,
      subject: `[Contact] ${subject} — from ${name}`,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #000000; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; letter-spacing: 6px; margin: 0; font-weight: 300;">VYRA</h1>
          </div>
          <div style="padding: 24px;">
            <h2 style="font-size: 18px; color: #111111; margin: 0 0 16px;">New Contact Form Submission</h2>
            <p style="color: #555555; font-size: 14px; margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
            <p style="color: #555555; font-size: 14px; margin: 0 0 8px;"><strong>Email:</strong> ${trimmedEmail}</p>
            <p style="color: #555555; font-size: 14px; margin: 0 0 8px;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #555555; font-size: 14px; margin: 16px 0 0;"><strong>Message:</strong></p>
            <p style="color: #333333; font-size: 14px; background: #f7f7f7; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    if (ownerError) {
      // Log it, but the message is already safely stored in Supabase — don't fail the request
      console.error("Resend error (notify owner) — message still saved in Supabase:", ownerError);
    } else {
      console.log("Contact notification sent to store, id:", ownerData?.id);
    }

    // Try to send auto-reply to the customer — best effort
    const { data: replyData, error: replyError } = await resend.emails.send({
      from: "VYRA <onboarding@resend.dev>",
      to: trimmedEmail,
      subject: "We received your message — VYRA",
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #000000; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; letter-spacing: 8px; margin: 0; font-weight: 300;">VYRA</h1>
          </div>
          <div style="padding: 32px; text-align: center;">
            <h2 style="font-size: 20px; color: #111111; margin: 0 0 12px;">Message received ✓</h2>
            <p style="color: #555555; font-size: 15px; margin: 0 0 8px;">Hey ${name}, thanks for reaching out!</p>
            <p style="color: #555555; font-size: 15px; margin: 0 0 24px;">We usually respond within 24 hours. Here's a copy of what you sent us:</p>
            <p style="color: #333333; font-size: 13px; background: #f7f7f7; padding: 12px; border-radius: 6px; text-align: left; white-space: pre-wrap;">${message}</p>
            <p style="color: #888888; font-size: 13px; margin: 24px 0 0;">Questions in the meantime? Email us at <a href="mailto:vyrastore07@gmail.com" style="color: #111111;">vyrastore07@gmail.com</a></p>
          </div>
          <div style="padding: 16px 32px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="font-size: 11px; color: #cccccc; letter-spacing: 2px; margin: 0;">© 2026 VYRA. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      `,
    });

    if (replyError) {
      console.error("Resend error (auto-reply) — non-critical:", replyError);
    } else {
      console.log("Auto-reply sent, id:", replyData?.id);
    }

    // Always succeed as long as the message is saved — email is a bonus, not a requirement
    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}