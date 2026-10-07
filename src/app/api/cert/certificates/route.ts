import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import {
  listCertificates,
  nextCertificateNumber,
  upsertCertificate,
} from "@/lib/cert/store";
import type { CertificateStatus } from "@/lib/cert/types";

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
    const certificate = await upsertCertificate({
      certificateNo: String(body.certificateNo || ""),
      customerId: String(body.customerId || ""),
      expireDate: String(body.expireDate || ""),
      status: (body.status || "valid") as CertificateStatus,
      notes: String(body.notes || ""),
      verificationToken: body.verificationToken
        ? String(body.verificationToken)
        : undefined,
      pages: Array.isArray(body.pages) ? body.pages : [],
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
