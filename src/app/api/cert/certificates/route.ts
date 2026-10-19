import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import {
  getCertificate,
  listCertificates,
  nextCertificateNumber,
  upsertCertificate,
} from "@/lib/cert/store";
import type { CertificatePageFile } from "@/lib/cert/types";
import { validateCertificateInput } from "@/lib/cert/validate";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Failed";
  if (message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (message.startsWith("Firebase is required")) {
    return NextResponse.json({ error: message }, { status: 503 });
  }
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: Request) {
  try {
    await requireSession();
    const url = new URL(request.url);
    if (url.searchParams.get("nextNumber") === "1") {
      return NextResponse.json({
        nextCertificateNo: await nextCertificateNumber(),
      });
    }
    const certificates = await listCertificates();
    return NextResponse.json(
      { certificates },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    return errorResponse(error);
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
      pages: checked.data.pages as CertificatePageFile[],
      createdById: session.id,
    });
    const verified = await getCertificate(certificate.id);
    if (!verified) {
      return NextResponse.json(
        {
          error:
            "Certificate write did not persist. Check Firebase configuration and try again.",
        },
        { status: 500 },
      );
    }
    revalidatePath("/certificate/admin/certificates");
    revalidatePath("/certificate/admin/certificates/");
    return NextResponse.json({ certificate: verified });
  } catch (error) {
    return errorResponse(error);
  }
}
