import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export type OrderStatus =
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type StoredOrder = {
  id: string;
  printify_order_id?: string;
  created_at?: string;
  status: OrderStatus;
  tracking_url?: string;
  tracking_number?: string;
  carrier?: string;
  items: {
    id: number;
    variant_id: number;
    name: string;
    price: number;
    size?: string;
    color?: string;
    quantity: number;
  }[];
  totals: {
    subtotalUSD: number;
    shippingUSD: number;
    totalUSD: number;
  };
  customer: {
    email: string;
    fullName: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
};

export async function saveOrder(order: StoredOrder): Promise<void> {
  const { error } = await supabase.from("orders").upsert({
    id: order.id,
    printify_order_id: order.printify_order_id ?? null,
    status: order.status,
    items: order.items,
    totals: order.totals,
    customer: order.customer,
    shipping_address: order.shippingAddress,
  });
  if (error) throw new Error(error.message);
}

export async function getOrderById(id: string): Promise<StoredOrder | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapRow(data);
}

export async function updateOrderByPrintifyId(
  printifyOrderId: string,
  updates: Partial<StoredOrder>
): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({
      status: updates.status,
      tracking_url: updates.tracking_url ?? null,
      tracking_number: updates.tracking_number ?? null,
      carrier: updates.carrier ?? null,
    })
    .eq("printify_order_id", printifyOrderId);
  return !error;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): StoredOrder {
  return {
    id: row.id,
    printify_order_id: row.printify_order_id,
    created_at: row.created_at,
    status: row.status,
    tracking_url: row.tracking_url,
    tracking_number: row.tracking_number,
    carrier: row.carrier,
    items: row.items,
    totals: row.totals,
    customer: row.customer,
    shippingAddress: row.shipping_address,
  };
}