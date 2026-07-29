import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function HostBookings() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  const bookings = await prisma.booking.findMany({
    where: { property: { hostId } },
    include: {
      property: { select: { name: true } },
      customer: { select: { name: true, image: true } }
    },
    orderBy: { startDate: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your upcoming stays and past guests.</p>
      </div>

      <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-mustard/30 border-b-2 border-foreground font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-foreground/10">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground font-bold">
                    No bookings found.
                  </td>
                </tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-bold flex items-center gap-3">
                    <img 
                      src={booking.customer.image || `https://api.dicebear.com/9.x/notionists/svg?seed=${booking.customer.name}`} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full border-2 border-foreground bg-cream object-cover"
                    />
                    {booking.customer.name || "Guest"}
                  </td>
                  <td className="px-6 py-4 font-bold">{booking.property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 font-display font-bold text-lg">
                    €{booking.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border-2 border-foreground shadow-hard-sm inline-flex items-center gap-1",
                      booking.status === "CONFIRMED" ? "bg-green-300 text-green-900" : 
                      booking.status === "PENDING" ? "bg-mustard text-yellow-900" : 
                      "bg-gray-200 text-gray-700"
                    )}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
