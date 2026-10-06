import { NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/cert/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identity = String(body.identity || "").trim();
    const password = String(body.password || "");
    if (!identity || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required." },
        { status: 400 },
      );
    }
    const user = await loginWithPassword(identity, password);
    if (!user) {
      return NextResponse.json(
        { error: "Incorrect username/email or password." },
        { status: 401 },
      );
    }
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
