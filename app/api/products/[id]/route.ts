// app/api/products/route.ts
import { NextResponse } from "next/server";

// TODO: adjust this import to your real backend function.
// Example:
// import { fetchPrintifyProducts } from "@/lib/printify";

async function fetchPrintifyProducts() {
  // Replace this with your real Printify fetching logic.
  // It must return an array of products where each has at least: { id, updated_at? }.
  return [];
}

export async function GET() {
  try {
    const products = await fetchPrintifyProducts();

    const items = products.map((p: any) => ({
      id: p.id,
      updatedAt: p.updated_at ?? p.updatedAt ?? null,
    }));

    return NextResponse.json({ products: items });
  } catch (error) {
    console.error("Error in /api/products:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
