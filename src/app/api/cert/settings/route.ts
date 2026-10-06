import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import { listAdmins } from "@/lib/cert/store";

export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const origin = new URL(request.url).origin;
    return NextResponse.json({
      currentUser: session,
      admins: session.role === "admin" ? await listAdmins() : [session],
      verificationBaseUrl: `${origin}/verify/`,
      uploadDirectory: "data/uploads",
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
