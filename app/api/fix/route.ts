import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    let updated = 0;
    for (const p of properties) {
      if (p.name.toLowerCase().includes("casa amarel")) {
        const json = p.landingPageJson as any;
        if (json) {
          if (!json.rooms) json.rooms = [{}];
          if (!json.rooms[0]) json.rooms[0] = {};
          json.rooms[0].photos = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"];
          
          await prisma.property.update({
            where: { id: p.id },
            data: { landingPageJson: json }
          });
          updated++;
        }
      }
    }
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
