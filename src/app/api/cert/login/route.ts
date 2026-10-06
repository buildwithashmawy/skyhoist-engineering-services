import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { COOKIE_NAME, loginWithPassword } from "@/lib/cert/auth";

function secretKey() {
  const secret =
    process.env.CERT_SESSION_SECRET ||
    "skyhoist-cert-dev-secret-change-me-32chars";
  return new TextEncoder().encode(secret);
}

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

    // Also attach Set-Cookie on the Response object for serverless reliability.
    const token = await new SignJWT({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey());

    const response = NextResponse.json({ user });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
