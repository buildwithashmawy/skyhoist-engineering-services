import { NextResponse } from "next/server";
import { requireAdmin, requireSession } from "@/lib/cert/auth";
import {
  adminResetPassword,
  changeOwnPassword,
} from "@/lib/cert/store";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const newPassword = String(body.newPassword || "");
    const targetUserId = String(body.userId || "").trim();

    // Admin resetting another account (no current password of the target).
    if (targetUserId && targetUserId !== session.id) {
      await requireAdmin();
      const user = await adminResetPassword(targetUserId, newPassword);
      return NextResponse.json({ user, mode: "admin-reset" });
    }

    // Self-service (admin or inspector): must prove current password.
    const currentPassword = String(body.currentPassword || "");
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required." },
        { status: 400 },
      );
    }
    const user = await changeOwnPassword(
      session.id,
      currentPassword,
      newPassword,
    );
    return NextResponse.json({ user, mode: "self" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Only the super admin can change other users' passwords." },
        { status: 403 },
      );
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
