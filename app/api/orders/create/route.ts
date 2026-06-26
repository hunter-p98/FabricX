import { NextRequest, NextResponse } from "next/server";
import { saveOrder, StoredOrder } from "../../../../lib/orders-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, items, totals, customer, shippingAddress } =
      body as StoredOrder;

    // 1. Build Printify order payload using real variant_ids from cart
    const printifyLineItems = items.map((item) => ({
      product_id: item.id.toString(),
      variant_id: item.variant_id,
      quantity: item.quantity,
    }));

    const printifyPayload = {
      external_id: id,
      label: id,
      line_items: printifyLineItems,
      shipping_method: 1,
      send_shipping_notification: true,
      address_to: {
        first_name: customer.fullName.split(" ")[0] ?? customer.fullName,
        last_name:
          customer.fullName.split(" ").slice(1).join(" ") || "-",
        email: customer.email,
        address1: shippingAddress.addressLine1,
        address2: shippingAddress.addressLine2 ?? "",
        city: shippingAddress.city,
        state: shippingAddress.state ?? "",
        zip: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
    };

    // 2. Submit to Printify
    let printifyOrderId: string | undefined;
    try {
      const printifyRes = await fetch(
        `${process.env.PRINTIFY_BASE_URL}/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          },
          body: JSON.stringify(printifyPayload),
        }
      );

      if (printifyRes.ok) {
        const printifyData = await printifyRes.json();
        printifyOrderId = printifyData?.id?.toString();
      } else {
        const errText = await printifyRes.text();
        console.error("Printify order creation failed:", errText);
      }
    } catch (err) {
      console.error("Printify API error:", err);
    }

    // 3. Save to Supabase with printify_order_id
    const orderToSave: StoredOrder = {
      ...body,
      status: "CONFIRMED",
      printify_order_id: printifyOrderId,
    };

    await saveOrder(orderToSave);

    return NextResponse.json({ success: true, orderId: id, printifyOrderId });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}