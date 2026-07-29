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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight">My Properties</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your boutique stays and view their performance.</p>
        </div>
        <Link href="/host/builder">
          <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm font-bold h-11 px-6 rounded-xl hover:bg-primary/90">
            + New Property
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const json = property.landingPageJson as any;
          const image = json?.rooms?.[0]?.photos?.[0] || null;
          const tagline = json?.tagline || "A beautiful stay";
          
          return (
            <div key={property.id} className="bg-white border-2 border-foreground shadow-hard rounded-2xl overflow-hidden flex flex-col">
              <div 
                className="aspect-video bg-mustard border-b-2 border-foreground relative bg-cover bg-center"
                style={image ? { backgroundImage: `url(${image})` } : {}}
              >
                {!image && <div className="absolute inset-0 flex items-center justify-center text-foreground/30 font-display font-bold">No Image</div>}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  <MapPin className="w-3 h-3" /> {property.description}
                </div>
                <h2 className="text-2xl font-display font-extrabold leading-tight">{property.name}</h2>
                <p className="font-hand text-lg text-muted-foreground leading-tight mt-1 mb-4 flex-1">{tagline}</p>
                
                <div className="bg-mustard/20 border-2 border-dashed border-foreground/40 rounded-xl p-3 mb-6 flex justify-between items-center">
                  <span className="font-bold text-sm text-muted-foreground">Total Bookings</span>
                  <span className="font-display font-black text-xl">{property._count.bookings}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/stay/${property.id}`} target="_blank" className="flex-1">
                    <Button variant="outline" className="w-full border-2 border-foreground shadow-hard-sm rounded-xl font-bold bg-white">
                      View Site <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-2 border-foreground shadow-hard-sm rounded-xl bg-white px-3" disabled title="Settings coming soon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
