import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Home, ExternalLink, Settings, MapPin, Plus } from "lucide-react";
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
          <h2 className="text-3xl font-display font-extrabold">Your Properties</h2>
        </div>
        <Link href="/host/builder">
          <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-11 font-bold hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Add Another Property
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
          const roomsCount = json?.rooms?.length || 1;
          
          return (
            <div key={property.id} className="hand-border bg-cream p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-primary">
                  <Home className="w-3 h-3" /> {property.description || "Unknown Location"}
                </div>
                <p className="mt-1 font-display text-2xl font-extrabold">{property.name}</p>
                <p className="text-sm text-muted-foreground mb-4">{roomsCount} room{roomsCount > 1 ? "s" : ""} · setup: {property.status}</p>
              </div>
              <div className="flex items-center gap-2 mt-auto pt-4 border-t-2 border-foreground/10">
                <Link href={`/host/builder?id=${property.id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-2 border-foreground rounded-xl font-bold">
                    Edit Property
                  </Button>
                </Link>
                <form action={deleteProperty.bind(null, property.id)}>
                  <Button type="submit" variant="destructive" className="border-2 border-foreground shadow-hard-sm rounded-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                    Delete
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
