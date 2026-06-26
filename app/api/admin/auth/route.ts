import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = "Gowtham@9873";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("vyra_admin", "true", {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
    secure: false,
  });
  return res;
}