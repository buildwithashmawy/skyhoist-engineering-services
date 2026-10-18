import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import {
  listCertificates,
  nextCertificateNumber,
  upsertCertificate,
} from "@/lib/cert/store";
import { validateCertificateInput } from "@/lib/cert/validate";

export async function GET(request: Request) {
  try {
    await requireSession();
    const url = new URL(request.url);
    if (url.searchParams.get("nextNumber") === "1") {
      return NextResponse.json({
        nextCertificateNo: await nextCertificateNumber(),
      });
    }
    return NextResponse.json({ certificates: await listCertificates() });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const checked = validateCertificateInput(body);
    if (!checked.ok) {
      return NextResponse.json(
        { error: checked.message, errors: checked.errors },
        { status: 400 },
      );
    }
    const certificate = await upsertCertificate({
      certificateNo: checked.data.certificateNo,
      customerId: checked.data.customerId,
      expireDate: checked.data.expireDate,
      status: checked.data.status,
      notes: checked.data.notes,
      verificationToken: checked.data.verificationToken,
      pages: checked.data.pages as import("@/lib/cert/types").CertificatePageFile[],
      createdById: session.id,
    });
    return NextResponse.json({ certificate });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
