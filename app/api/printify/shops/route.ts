// app/api/printify/shops/route.ts
import { NextResponse } from "next/server";

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_BASE_URL =
  process.env.PRINTIFY_BASE_URL || "https://api.printify.com/v1";

export async function GET() {
  if (!PRINTIFY_API_TOKEN) {
    return NextResponse.json(
      { error: "PRINTIFY_API_TOKEN is not set" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${PRINTIFY_BASE_URL}/shops.json`, {
      headers: {
        Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Printify shops error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to fetch shops from Printify" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Printify shops exception:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
