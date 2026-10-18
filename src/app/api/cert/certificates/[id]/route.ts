import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import {
  cloneCertificate,
  deleteCertificate,
  getCertificate,
  upsertCertificate,
} from "@/lib/cert/store";
import type { CertificatePageFile } from "@/lib/cert/types";
import { validateCertificateInput } from "@/lib/cert/validate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    await requireSession();
    const { id } = await ctx.params;
    const certificate = await getCertificate(id);
    if (!certificate) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ certificate });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const session = await requireSession();
    const { id } = await ctx.params;
    const body = await request.json();
    const checked = validateCertificateInput(body);
    if (!checked.ok) {
      return NextResponse.json(
        { error: checked.message, errors: checked.errors },
        { status: 400 },
      );
    }
    const certificate = await upsertCertificate({
      id,
      certificateNo: checked.data.certificateNo,
      customerId: checked.data.customerId,
      expireDate: checked.data.expireDate,
      status: checked.data.status,
      notes: checked.data.notes,
      verificationToken: checked.data.verificationToken,
      pages: Array.isArray(body.pages)
        ? (checked.data.pages as CertificatePageFile[])
        : undefined,
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

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireSession();
    const { id } = await ctx.params;
    await deleteCertificate(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request, ctx: Ctx) {
  try {
    const session = await requireSession();
    const { id } = await ctx.params;
    const body = await request.json().catch(() => ({}));
    if (body.action === "clone") {
      const certificate = await cloneCertificate(id, session.id);
      return NextResponse.json({ certificate });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
