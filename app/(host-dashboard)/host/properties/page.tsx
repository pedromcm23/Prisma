import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Home, ExternalLink, Settings, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <h2 className="text-3xl font-display font-extrabold">Your Properties</h2>
        </div>
        <Link href="/host/builder">
          <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-11 font-bold hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Add Another Property
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {properties.map((property) => {
          const json = property.landingPageJson as any;
          const roomsCount = json?.rooms?.length || 1;
          
          return (
            <div key={property.id} className="hand-border bg-cream p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-primary">
                <Home className="w-3 h-3" /> {property.description || "Unknown Location"}
              </div>
              <p className="mt-1 font-display text-2xl font-extrabold">{property.name}</p>
              <p className="text-sm text-muted-foreground">{roomsCount} room{roomsCount > 1 ? "s" : ""} · setup: {property.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
