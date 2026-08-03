import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await prisma.user.update({
    where: { email: "pedromcm23@gmail.com" },
    data: { role: "CUSTOMER" },
  });
  return NextResponse.json({ success: true, user });
}
