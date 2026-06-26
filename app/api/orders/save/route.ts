import { NextRequest, NextResponse } from "next/server";
import { saveOrder, StoredOrder } from "../../../lib/orders-store";

export async function POST(req: NextRequest) {
  try {
    const body: StoredOrder = await req.json();
    await saveOrder(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save order error:", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}