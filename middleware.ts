import { NextRequest, NextResponse } from "next/server";

type Currency = "USD" | "EUR" | "INR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF";

// Map country codes to currencies
const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
  US: "USD",
  GB: "GBP",
  IN: "INR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  JP: "JPY",
  AU: "AUD",
  CA: "CAD",
  CH: "CHF",
  NZ: "AUD",
  SG: "USD",
  AE: "USD",
  SA: "USD",
  PK: "USD",
  BD: "USD",
  LK: "USD",
  NG: "USD",
  ZA: "USD",
  BR: "USD",
  MX: "USD",
  AR: "USD",
};

function detectCurrency(req: NextRequest): Currency {
  // 1. Check if user already has a manually set cookie
  const existing = req.cookies.get("fabricx_currency");
  if (existing?.value && COUNTRY_TO_CURRENCY[existing.value] !== undefined) {
    return existing.value as Currency;
  }

  // 2. Use Vercel's geo header (works on Vercel deployment)
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") || // Cloudflare
    "";

  if (country && COUNTRY_TO_CURRENCY[country]) {
    return COUNTRY_TO_CURRENCY[country];
  }

  // 3. Fall back to Accept-Language header
  const lang = req.headers.get("accept-language") || "";
  if (lang.startsWith("en-IN") || lang.includes("hi")) return "INR";
  if (lang.startsWith("en-GB")) return "GBP";
  if (lang.startsWith("en-AU")) return "AUD";
  if (lang.startsWith("en-CA")) return "CAD";
  if (lang.startsWith("ja")) return "JPY";
  if (lang.startsWith("de-CH")) return "CHF";
  if (
    lang.startsWith("de") ||
    lang.startsWith("fr") ||
    lang.startsWith("it") ||
    lang.startsWith("es") ||
    lang.startsWith("nl") ||
    lang.startsWith("pt")
  )
    return "EUR";

  return "USD";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin auth check
  if (pathname.startsWith("/admin/dashboard")) {
    const cookie = req.cookies.get("vyra_admin");
    if (!cookie || cookie.value !== "true") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  const response = NextResponse.next();

  // Auto-detect currency only if user hasn't manually set one
  const existingCurrency = req.cookies.get("fabricx_currency");
  if (!existingCurrency) {
    const detected = detectCurrency(req);
    response.cookies.set("fabricx_currency", detected, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};