import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import { listCustomers, upsertCustomer } from "@/lib/cert/store";
import { validateCustomerInput } from "@/lib/cert/validate";

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
    const checked = validateCustomerInput(body);
    if (!checked.ok) {
      return NextResponse.json(
        { error: checked.message, errors: checked.errors },
        { status: 400 },
      );
    }
    const customer = await upsertCustomer({
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
