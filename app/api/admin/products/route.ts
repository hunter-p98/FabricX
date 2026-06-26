import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("vyra_admin");
  if (!cookie || cookie.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.PRINTIFY_BASE_URL}/shops/${process.env.PRINTIFY_SHOP_ID}/products.json?limit=50`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ products: data.data ?? [] });
}