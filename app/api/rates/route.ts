import { NextResponse } from "next/server";

export const revalidate = 60 * 60; // cache for 1 hour

export async function GET() {
  const url = process.env.FX_API_URL;
  const apiKey = process.env.FX_API_KEY;

  if (!url) {
    return NextResponse.json(
      { error: "FX_API_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(url, {
      headers: apiKey
        ? { Authorization: `Bearer ${apiKey}` }
        : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("FX API error:", text);
      return NextResponse.json(
        { error: "Failed to fetch rates" },
        { status: 500 }
      );
    }

    const data = await res.json();

    const rates =
      (data.rates ??
        data.conversion_rates) as Record<string, number> | undefined;

    if (!rates) {
      return NextResponse.json(
        { error: "Rates missing from FX API response" },
        { status: 500 }
      );
    }

    if (!rates["USD"]) {
      rates["USD"] = 1;
    }

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("FX API fetch error:", error);
    return NextResponse.json(
      { error: "Unexpected error fetching rates" },
      { status: 500 }
    );
  }
}
