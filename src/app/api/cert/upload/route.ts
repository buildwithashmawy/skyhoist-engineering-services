import { NextResponse } from "next/server";
import { requireSession } from "@/lib/cert/auth";
import { saveUpload } from "@/lib/cert/store";

export async function POST(request: Request) {
  try {
    await requireSession();
    const form = await request.formData();
    const file = form.get("file");
    const page = Number(form.get("page") || 1);
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }
    if (page < 1 || page > 5) {
      return NextResponse.json({ error: "Page must be 1-5." }, { status: 400 });
    }
    const uploaded = await saveUpload(file, page);
    return NextResponse.json({ file: uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
