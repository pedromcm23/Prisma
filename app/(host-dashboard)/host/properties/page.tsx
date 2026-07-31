import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Home, ExternalLink, Settings, MapPin, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteProperty } from "@/app/actions/property";

export default async function HostProperties() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  let properties = await prisma.property.findMany({
    where: { hostId },
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });

  if (properties.length === 0) {
    // Fallback to exact Lovable mock data
    properties = [
      {
        id: "mock-1",
        name: "Casa Amarela",
        description: "Alfama, Lisbon",
        status: "LIVE",
        landingPageJson: { rooms: [{}] },
      } as any
    ];
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="font-hand text-2xl text-accent">everything under one roof</p>
          <h2 className="text-3xl font-display font-extrabold">Property Management</h2>
        </div>
        <Link href="/host/builder">
          <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-full h-11 px-6 font-bold hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add New Property
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {properties.length === 0 && (
          <div className="col-span-2 p-8 text-center text-muted-foreground border-2 border-dashed border-foreground/20 rounded-xl">
            You haven't added any properties yet.
          </div>
        )}
        {properties.map((property) => {
          const json = property.landingPageJson as any;
          const rooms = json?.rooms || [];
          const roomsCount = rooms.length;
          const price = rooms[0]?.price || json?.basePrice || 150;
          const image = rooms[0]?.photos?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop";
          
          return (
            <div key={property.id} className="hand-border bg-white overflow-hidden flex flex-col justify-between">
              <Link href={`/host/builder?id=${property.id}`} className="block relative aspect-[21/9] overflow-hidden border-b-2 border-foreground group">
                <img src={image} alt={property.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-bold text-lg backdrop-blur-sm">
                  Click to Edit
                </div>
              </Link>
              
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-accent">
                  <MapPin className="w-3 h-3" /> {property.description || "Unknown Location"}
                </div>
                
                <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight">{property.name}</h3>
                <p className="text-xs font-bold text-muted-foreground mt-1 mb-4">
                  {roomsCount} room{roomsCount !== 1 ? "s" : ""} · from €{price}/night · setup: {json ? "ai" : "blank"}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {rooms.slice(0, 3).map((r: any, i: number) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded-full border-2 border-foreground text-[10px] uppercase font-bold tracking-wider">
                      {r.name || `Room ${i + 1}`}
                    </span>
                  ))}
                  {rooms.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full border-2 border-foreground text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      +{rooms.length - 3} more
                    </span>
                  )}
                </div>

                <form action={deleteProperty.bind(null, property.id)}>
                  <Button 
                    type="submit" 
                    variant="outline" 
                    className="border-2 border-foreground rounded-full px-4 h-9 font-bold bg-white hover:bg-black/5 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove Property
                  </Button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
