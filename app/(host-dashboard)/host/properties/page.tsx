import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Home, ExternalLink, Settings, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HostProperties() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  const properties = await prisma.property.findMany({
    where: { hostId },
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });

  return (
    <div>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="font-hand text-2xl text-accent">everything under one roof</p>
          <h2 className="text-3xl font-display font-extrabold">Your Properties</h2>
        </div>
        <Link href="/host/builder">
          <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-11 font-bold hover:bg-primary/90">
            + Add Another Property
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="hand-border bg-white p-10 text-center">
          <Home className="w-8 h-8 mx-auto text-primary mb-3" />
          <p className="font-display text-2xl font-bold">No properties yet</p>
          <p className="text-sm text-muted-foreground mt-1">Complete the builder or add a new one to see it here.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {properties.map((property) => {
            const json = property.landingPageJson as any;
            const roomsCount = json?.rooms?.length || 1;
            
            return (
              <div key={property.id} className="hand-border bg-cream p-5 flex flex-col">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-primary">
                  <MapPin className="w-3 h-3" /> {property.description || "Unknown Location"}
                </div>
                <p className="mt-1 font-display text-2xl font-extrabold">{property.name}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {roomsCount} room{roomsCount !== 1 ? "s" : ""} · {property._count.bookings} bookings
                </p>
                
                <div className="mt-auto pt-4 flex gap-2">
                  <Link href={`/stay/${property.id}`} target="_blank" className="flex-1">
                    <Button variant="outline" className="w-full border-2 border-foreground shadow-hard-sm rounded-xl font-bold bg-white hover:bg-mustard/30">
                      View Site <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-2 border-foreground shadow-hard-sm rounded-xl bg-white px-3 hover:bg-mustard/30" disabled title="Settings coming soon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
