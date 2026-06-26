import { NextRequest, NextResponse } from "next/server";
import { updateOrderByPrintifyId, OrderStatus } from "../../../../lib/orders-store";

function mapPrintifyEvent(event: string): OrderStatus | null {
  switch (event) {
    case "order:created":
    case "order:updated":
      return "PROCESSING";
    case "order:shipped":
      return "SHIPPED";
    case "order:fulfilled":
      return "DELIVERED";
    case "order:cancelled":
      return "CANCELLED";
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body?.type as string;
    const resource = body?.resource?.data;

    if (!event || !resource) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const printifyOrderId = resource?.id?.toString();
    const newStatus = mapPrintifyEvent(event);

    if (!printifyOrderId || !newStatus) {
      return NextResponse.json({ received: true });
    }

    const shipments = resource?.shipments ?? [];
    const tracking = shipments[0] ?? null;

    await updateOrderByPrintifyId(printifyOrderId, {
      status: newStatus,
      tracking_url: tracking?.url ?? undefined,
      tracking_number: tracking?.number ?? undefined,
      carrier: tracking?.carrier ?? undefined,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}