import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import {
  deleteCustomer,
  getCustomer,
  upsertCustomer,
} from "@/lib/cert/store";
import { validateCustomerInput } from "@/lib/cert/validate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    await requireSession();
    const { id } = await ctx.params;
    const customer = await getCustomer(id);
    if (!customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    await requireSession();
    const { id } = await ctx.params;
    const body = await request.json();
    const checked = validateCustomerInput(body);
    if (!checked.ok) {
      return NextResponse.json(
        { error: checked.message, errors: checked.errors },
        { status: 400 },
      );
    }
    const customer = await upsertCustomer({
      id,
      fullName: checked.data.fullName,
      email: checked.data.email,
      phone: checked.data.phone,
      status: checked.data.status,
    });
    return NextResponse.json({ customer });
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
    await deleteCustomer(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
