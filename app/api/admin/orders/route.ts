import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("vyra_admin");
  if (!cookie || cookie.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
    console.log("KEY exists:", !!process.env.SUPABASE_SECRET_KEY);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error("Catch error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}