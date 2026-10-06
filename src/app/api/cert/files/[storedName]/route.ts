import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/cert/auth";
import { getCertificateByToken, uploadPath } from "@/lib/cert/store";

type Ctx = { params: Promise<{ storedName: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const { storedName } = await ctx.params;
  if (!storedName || storedName.includes("..") || storedName.includes("/")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const session = await getSession();

  if (!session) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const cert = await getCertificateByToken(token);
    if (!cert?.pages.some((p) => p.storedName === storedName)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const data = await fs.readFile(uploadPath(storedName));
    const ext = storedName.split(".").pop()?.toLowerCase();
    const type =
      ext === "pdf"
        ? "application/pdf"
        : ext === "png"
          ? "image/png"
          : ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : "application/octet-stream";
    return new NextResponse(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
