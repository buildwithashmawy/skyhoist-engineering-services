import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { CertRole, SessionUser } from "./types";
import { findUserByIdentity, publicUser } from "./store";

const COOKIE_NAME = "skyhoist_cert_session";

function secretKey() {
  const secret =
    process.env.CERT_SESSION_SECRET ||
    "skyhoist-cert-dev-secret-change-me-32chars";
  return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser) {
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

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const id = String(payload.id || "");
    const username = String(payload.username || "");
    const email = String(payload.email || "");
    const fullName = String(payload.fullName || "");
    const role = String(payload.role || "") as CertRole;
    if (!id || !username || (role !== "admin" && role !== "operator")) {
      return null;
    }
    // Trust the signed JWT. Do not require a local /tmp store lookup —
    // serverless instances do not share filesystem state.
    return { id, fullName, username, email, role };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.role !== "admin") throw new Error("FORBIDDEN");
  return session;
}

export async function loginWithPassword(identity: string, password: string) {
  const user = await findUserByIdentity(identity);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  const session = publicUser(user);
  await createSession(session);
  return session;
}

export { COOKIE_NAME };
