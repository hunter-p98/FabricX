// app/api/printify/products/route.ts
import { NextResponse } from "next/server";

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const PRINTIFY_BASE_URL =
  process.env.PRINTIFY_BASE_URL || "https://api.printify.com/v1";

export async function GET() {
  if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
    return NextResponse.json(
      { error: "Printify API not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `${PRINTIFY_BASE_URL}/shops/${PRINTIFY_SHOP_ID}/products.json`,
      {
        headers: {
          Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Printify products error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to fetch products from Printify" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Printify products exception:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
