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
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Try inserting into Supabase
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmedEmail });

    if (dbError) {
      // Postgres unique violation code = 23505 (already subscribed)
      if (dbError.code === "23505") {
        return NextResponse.json(
          { success: false, error: "You're already subscribed!" },
          { status: 409 }
        );
      }
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // Notify store owner (non-blocking — don't fail the request if this fails)
    try {
      await resend.emails.send({
        from: "VYRA Store <onboarding@resend.dev>",
        to: "vyrastore07@gmail.com",
        subject: "New Newsletter Signup - VYRA",
        html: `
          <div style="font-family: Helvetica, Arial, sans-serif; padding: 20px;">
            <h2>New Newsletter Signup</h2>
            <p><strong>Email:</strong> ${trimmedEmail}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }

    // Welcome email to subscriber (non-blocking)
    try {
      await resend.emails.send({
        from: "VYRA <onboarding@resend.dev>",
        to: trimmedEmail,
        subject: "Welcome to VYRA",
        html: `
          <div style="font-family: Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <div style="background: #000000; padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; letter-spacing: 8px; margin: 0; font-weight: 300;">VYRA</h1>
            </div>
            <div style="padding: 32px; text-align: center;">
              <h2 style="font-size: 20px; color: #111111; margin: 0 0 12px;">You're on the list ✓</h2>
              <p style="color: #555555; font-size: 15px; margin: 0 0 8px;">Thanks for subscribing! You'll be the first to know about new drops, exclusive offers, and updates.</p>
              <p style="color: #888888; font-size: 13px; margin: 24px 0 0;">Questions? Email us at <a href="mailto:vyrastore07@gmail.com" style="color: #111111;">vyrastore07@gmail.com</a></p>
            </div>
            <div style="padding: 16px 32px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="font-size: 11px; color: #cccccc; letter-spacing: 2px; margin: 0;">© 2026 VYRA. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}