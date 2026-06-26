// app/api/fabricx/products/route.ts
import { NextResponse } from "next/server";

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const PRINTIFY_BASE_URL =
  process.env.PRINTIFY_BASE_URL || "https://api.printify.com/v1";

type PrintifyListItem = {
  id: string;
  title: string;
  // list call has more fields, but we only care about id/title here
};

type PrintifyListResponse = {
  current_page: number;
  data: PrintifyListItem[];
};

export async function GET() {
  if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
    return NextResponse.json(
      { error: "Printify API not configured" },
      { status: 500 }
    );
  }

  const listUrl = `${PRINTIFY_BASE_URL}/shops/${PRINTIFY_SHOP_ID}/products.json?limit=50`;

  try {
    // 1) Get lightweight list
    const listRes = await fetch(listUrl, {
      headers: {
        Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!listRes.ok) {
      const text = await listRes.text();
      console.error("FabricX list error:", listRes.status, text);
      return NextResponse.json(
        { error: "Failed to fetch product list" },
        { status: 500 }
      );
    }

    const listJson = (await listRes.json()) as PrintifyListResponse;
    const items = Array.isArray(listJson.data) ? listJson.data : [];

    // 2) For each product, fetch full details from /products/{id}.json
    const detailPromises = items.map(async (item) => {
      const detailUrl = `${PRINTIFY_BASE_URL}/shops/${PRINTIFY_SHOP_ID}/products/${item.id}.json`;

      try {
        const detailRes = await fetch(detailUrl, {
          headers: {
            Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!detailRes.ok) {
          const text = await detailRes.text();
          console.error(
            "FabricX product detail error:",
            item.id,
            detailRes.status,
            text
          );
          return null;
        }

        const detailJson = await detailRes.json();

        // Optional: skip archived/removed products
        if (detailJson.visible === false) {
          return null;
        }

        return detailJson;
      } catch (err) {
        console.error("FabricX product detail exception:", item.id, err);
        return null;
      }
    });

    const detailResults = await Promise.all(detailPromises);
    const fullProducts = detailResults.filter((p) => p !== null);

    // Shape we send to frontend:
    //   { current_page, data: [ full product objects from Printify ] }
    return NextResponse.json({
      current_page: listJson.current_page,
      data: fullProducts,
    });
  } catch (err) {
    console.error("FabricX list exception:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
