import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cert/auth";
import { createOperator, listOperators } from "@/lib/cert/store";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ operators: await listOperators() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const operator = await createOperator({
      fullName: String(body.fullName || ""),
      username: String(body.username || ""),
      email: String(body.email || ""),
      password: String(body.password || ""),
      createdById: admin.id,
    });
    return NextResponse.json({ operator });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
