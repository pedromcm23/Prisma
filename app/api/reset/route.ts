import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  await prisma.user.updateMany({
    where: { 
      email: { in: ["pedromcm1623@gmail.com", "pedromcm1723@gmail.com"] }
    },
    data: { role: "HOST" }
  });
  return NextResponse.json({ success: true, message: "Host accounts restored" });
}
