import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import {
  getStoreBackend,
  listAdmins,
  listDirectoryUsers,
  listOperators,
} from "@/lib/cert/store";

export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const origin = new URL(request.url).origin;
    const backend = getStoreBackend();
    const isAdmin = session.role === "admin";
    return NextResponse.json({
      currentUser: session,
      admins: isAdmin ? await listAdmins() : [session],
      operators: isAdmin ? await listOperators() : [],
      users: isAdmin ? await listDirectoryUsers() : [session],
      verificationBaseUrl: `${origin}/verify/`,
      storeBackend: backend,
      uploadDirectory:
        backend === "firebase"
          ? process.env.FIREBASE_UPLOAD_BACKEND === "storage"
            ? `gs://${process.env.FIREBASE_STORAGE_BUCKET || "…"}/cert-uploads`
            : "Firestore certUploads"
          : "data/uploads",
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
