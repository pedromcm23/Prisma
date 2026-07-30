import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (id) {
      const property = await prisma.property.findUnique({ where: { id } });
      return NextResponse.json({ property });
    }
    const properties = await prisma.property.findMany();
    return NextResponse.json({ properties });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
