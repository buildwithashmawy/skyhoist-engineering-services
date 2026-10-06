import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import { getStoreBackend, listAdmins } from "@/lib/cert/store";

export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const origin = new URL(request.url).origin;
    const backend = getStoreBackend();
    return NextResponse.json({
      currentUser: session,
      admins: session.role === "admin" ? await listAdmins() : [session],
      verificationBaseUrl: `${origin}/verify/`,
      storeBackend: backend,
      uploadDirectory:
        backend === "firebase" ? "gs://…/cert-uploads" : "data/uploads",
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
