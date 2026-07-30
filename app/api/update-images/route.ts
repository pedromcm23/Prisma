import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    for (const p of properties) {
      if (p.name.toLowerCase().includes("casa amarela") || p.name.toLowerCase().includes("riad nour")) {
        const data = p.landingPageJson as any;
        if (!data) continue;
        
        if (!data.rooms) data.rooms = [{}];
        if (!data.rooms[0].photos) data.rooms[0].photos = [];
        
        if (p.name.toLowerCase().includes("casa amarela")) {
          data.rooms[0].photos[0] = "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=1200&auto=format&fit=crop";
        } else {
          data.rooms[0].photos[0] = "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200&auto=format&fit=crop";
        }
        
        await prisma.property.update({
          where: { id: p.id },
          data: { landingPageJson: data }
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
