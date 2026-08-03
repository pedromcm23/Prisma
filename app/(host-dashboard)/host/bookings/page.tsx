import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CancelBookingButton } from "./CancelBookingButton";

export default async function HostBookings() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  let bookings = await prisma.booking.findMany({
    where: { property: { hostId } },
    include: {
      property: { select: { name: true } },
      customer: { select: { name: true, image: true, email: true } }
    },
    orderBy: { startDate: "desc" }
  });

  // Removed mock data as requested

  return (
    <div>
      <div className="mb-6">
        <p className="font-hand text-2xl text-accent">who stayed with you</p>
        <h2 className="text-3xl font-display font-extrabold">Booking History</h2>
      </div>

      <div className="hand-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-mustard/40 border-b-2 border-foreground">
              <tr className="text-left">
                {["Guest", "Property", "Dates", "Status", "Review"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs uppercase tracking-wider font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No bookings found.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-foreground/10 last:border-0 align-top">
                  <td className="px-4 py-3">
                    <p className="font-bold">{b.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{b.customer.email}</p>
                  </td>
                  <td className="px-4 py-3">{b.property.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {format(new Date(b.startDate), "MMM d")} → {format(new Date(b.endDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3 flex items-center justify-between">
                    <span className={cn(
                      "inline-block rounded-full border-2 border-foreground px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                      b.status === "CONFIRMED" && "bg-cream",
                      b.status === "PENDING" && "bg-mustard",
                      b.status === "CANCELLED" && "bg-white text-muted-foreground",
                    )}>
                      {b.status === "CONFIRMED" ? "COMPLETED" : b.status === "PENDING" ? "UPCOMING" : b.status}
                    </span>
                    <CancelBookingButton bookingId={b.id} />
                  </td>
                  <td className="px-4 py-3 max-w-[280px]">
                    {(b as any).review ? (
                      <div>
                        <div className="text-xs text-primary font-bold">★ {(b as any).review.rating}</div>
                        <p className="text-xs text-muted-foreground italic">"{(b as any).review.text}"</p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
