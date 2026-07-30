import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    
    let updatedCasa = false;
    let updatedRiad = false;

    for (const property of properties) {
      if (property.name === "Casa Amarela") {
        let json = property.landingPageJson as any;
        if (!json) json = {};
        if (!json.rooms) json.rooms = [{}];
        if (!json.rooms[0].photos) json.rooms[0].photos = [];
        
        json.rooms[0].photos[0] = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop";
        
        await prisma.property.update({
          where: { id: property.id },
          data: { landingPageJson: json }
        });
        updatedCasa = true;
      } else if (property.name === "Riad Nour") {
        let json = property.landingPageJson as any;
        if (!json) json = {};
        if (!json.rooms) json.rooms = [{}];
        if (!json.rooms[0].photos) json.rooms[0].photos = [];
        
        json.rooms[0].photos[0] = "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200&auto=format&fit=crop";
        
        await prisma.property.update({
          where: { id: property.id },
          data: { landingPageJson: json }
        });
        updatedRiad = true;
      }
    }

    return NextResponse.json({ success: true, updatedCasa, updatedRiad });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
