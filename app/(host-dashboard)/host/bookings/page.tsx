import { Calendar, Coffee, User, MapPin, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BOOKINGS = [
  {
    id: "bk-1",
    status: "current",
    guestName: "Alice Walker",
    dates: "Oct 12 - Oct 15",
    property: "Coastal Villa",
    price: 360,
    perk: "Welcome breakfast basket",
    image: "https://i.pravatar.cc/150?u=a",
  },
  {
    id: "bk-2",
    status: "upcoming",
    guestName: "John & Mary",
    dates: "Nov 2 - Nov 7",
    property: "Downtown Loft",
    price: 600,
    perk: "Late checkout (2pm)",
    image: "https://i.pravatar.cc/150?u=b",
  },
  {
    id: "bk-3",
    status: "past",
    guestName: "Sophie Taylor",
    dates: "Sep 1 - Sep 3",
    property: "Coastal Villa",
    price: 240,
    perk: "None",
    image: "https://i.pravatar.cc/150?u=c",
  }
];

export default function BookingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Reservations</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your direct bookings and prepare guest perks.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* CURRENT */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Current Guests
          </h2>
          {BOOKINGS.filter(b => b.status === "current").map(b => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>

        {/* UPCOMING */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Upcoming
          </h2>
          {BOOKINGS.filter(b => b.status === "upcoming").map(b => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>

        {/* PAST */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            Past
          </h2>
          {BOOKINGS.filter(b => b.status === "past").map(b => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>

      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const isPast = booking.status === "past";
  return (
    <div className={cn(
      "bg-white border-2 border-foreground shadow-hard-sm rounded-xl p-4 transition-all hover:-translate-y-1 hover:shadow-hard",
      isPast && "opacity-60 bg-gray-50 grayscale"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img src={booking.image} className="w-10 h-10 rounded-full border-2 border-foreground object-cover" />
          <div>
            <h3 className="font-bold leading-none">{booking.guestName}</h3>
            <p className="text-xs text-muted-foreground font-bold mt-1">{booking.property}</p>
          </div>
        </div>
        <span className="font-display font-bold text-lg">€{booking.price}</span>
      </div>

      <div className="space-y-2 mt-4 text-sm font-medium">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          {booking.dates}
        </div>
        {booking.perk !== "None" && (
          <div className="flex items-center gap-2 text-accent">
            <Coffee className="w-4 h-4" />
            Perk: {booking.perk}
          </div>
        )}
      </div>
    </div>
  );
}
