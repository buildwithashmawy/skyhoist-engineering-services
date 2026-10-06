import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import {
  cloneCertificate,
  deleteCertificate,
  getCertificate,
  upsertCertificate,
} from "@/lib/cert/store";
import type { CertificateStatus } from "@/lib/cert/types";

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
    const certificate = await upsertCertificate({
      id,
      certificateNo: String(body.certificateNo || ""),
      customerId: String(body.customerId || ""),
      expireDate: String(body.expireDate || ""),
      status: (body.status || "valid") as CertificateStatus,
      notes: String(body.notes || ""),
      verificationToken: body.verificationToken
        ? String(body.verificationToken)
        : undefined,
      pages: Array.isArray(body.pages) ? body.pages : undefined,
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
