import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  await prisma.user.updateMany({
    where: { 
      email: { in: ["pedromcm23@gmail.com", "pedromcm1823@gmail.com", "pedromcm1623@gmail.com", "pedromcm1723@gmail.com"] }
    },
    data: { role: "CUSTOMER" }
  });
  return NextResponse.json({ success: true, message: "Accounts reset to CUSTOMER" });
}
