// app/api/orders/route.ts
import { NextResponse } from "next/server";

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const PRINTIFY_BASE_URL = process.env.PRINTIFY_BASE_URL || "https://api.printify.com/v1";

export async function POST(request: Request) {
  try {
    if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
      return NextResponse.json(
        { error: "Printify API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { customer, items, orderId } = body;

    // Build Printify line items
    const lineItems = items.map((item: any) => ({
      product_id: item.id,
      variant_id: item.variantId,
      quantity: item.quantity,
    }));

    // Build Printify order payload
    const printifyPayload = {
      external_id: orderId,
      label: orderId,
      line_items: lineItems,
      shipping_method: 1,
      is_printify_express: false,
      send_shipping_notification: true,
      address_to: {
        first_name: customer.fullName.split(" ")[0] || customer.fullName,
        last_name: customer.fullName.split(" ").slice(1).join(" ") || "-",
        email: customer.email,
        phone: customer.phone,
        country: customer.country,
        region: customer.state || "",
        address1: customer.addressLine1,
        address2: customer.addressLine2 || "",
        city: customer.city,
        zip: customer.postalCode,
      },
    };

    // Submit to Printify
    const printifyRes = await fetch(
      `${PRINTIFY_BASE_URL}/shops/${PRINTIFY_SHOP_ID}/orders.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(printifyPayload),
      }
    );

    const printifyData = await printifyRes.json();

    if (!printifyRes.ok) {
      console.error("Printify order error:", printifyData);
      return NextResponse.json(
        { error: "Failed to submit order to Printify", details: printifyData },
        { status: 500 }
      );
    }

    // Send order confirmation email via API
    // (plugged in later when email is set up)

    return NextResponse.json({
      success: true,
      printifyOrderId: printifyData.id,
      orderId,
    });

  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}