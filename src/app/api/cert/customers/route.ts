import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import { listCustomers, upsertCustomer } from "@/lib/cert/store";
import type { CustomerStatus } from "@/lib/cert/types";

export async function GET() {
  try {
    await requireSession();
    return NextResponse.json({ customers: await listCustomers() });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const customer = await upsertCustomer({
      fullName: String(body.fullName || ""),
      email: String(body.email || ""),
      phone: String(body.phone || ""),
      status: (body.status || "verified") as CustomerStatus,
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
