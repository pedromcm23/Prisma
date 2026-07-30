import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.user.updateMany({
      where: { email: "pedromcm1623@gmail.com" },
      data: { name: "Pedro16" }
    });

    await prisma.user.updateMany({
      where: { email: "pedromcm1723@gmail.com" },
      data: { name: "Pedro17" }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
