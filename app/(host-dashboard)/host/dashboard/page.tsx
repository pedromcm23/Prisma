import { PiggyBank, TrendingUp, MousePointerClick, HeartHandshake, ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function HostDashboard() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  // Fetch all bookings for the host's properties
  const bookings = await prisma.booking.findMany({
    where: { property: { hostId } },
    select: { totalPrice: true, startDate: true, status: true }
  });

  // Calculate Revenue
  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
  const revenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  
  // Airbnb usually takes around 15% from the host/guest combo. Let's calculate 15% as total saved.
  const savings = Math.round(revenue * 0.15);

  // Group revenue by month for the last 5 months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  const chartData = [];
  for (let i = 4; i >= 0; i--) {
    const targetMonth = (currentMonth - i + 12) % 12;
    const targetYear = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0);
    
    const monthRevenue = confirmedBookings
      .filter(b => new Date(b.startDate).getMonth() === targetMonth && new Date(b.startDate).getFullYear() === targetYear)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      
    chartData.push({
      month: months[targetMonth],
      revenue: monthRevenue
    });
  }

  const maxRev = Math.max(...chartData.map(d => d.revenue), 100); // ensure not dividing by 0

  // Fetch approved perks
  const perkRedemptions = await prisma.guestPerk.count({
    where: { hostId, status: "approved" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Welcome back, {session?.user?.name?.split(" ")[0] || "Host"}!</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your direct booking impact and financial savings.</p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-mustard border-2 border-foreground shadow-hard rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-5 h-5 text-foreground" />
            <h2 className="font-bold">Total Saved</h2>
          </div>
          <p className="text-4xl font-display font-black text-foreground">€{savings}</p>
          <p className="text-sm font-bold text-foreground/70 mt-1">vs 15% OTAs fees</p>
        </div>

        <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Direct Revenue</h2>
          </div>
          <p className="text-4xl font-display font-black">€{revenue}</p>
          <p className="text-sm font-bold text-green-600 mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-1" /> All-time
          </p>
        </div>

        <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <MousePointerClick className="w-5 h-5 text-accent" />
            <h2 className="font-bold">Conversion Rate</h2>
          </div>
          <p className="text-4xl font-display font-black">12.4%</p>
          <p className="text-sm text-muted-foreground font-bold mt-1">From landing page</p>
        </div>

        <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Perk Redemptions</h2>
          </div>
          <p className="text-4xl font-display font-black">{perkRedemptions}</p>
          <p className="text-sm text-muted-foreground font-bold mt-1">Guests claimed perks</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-6">Direct Revenue Growth (Last 5 Months)</h2>
        <div className="h-64 flex items-end gap-2 sm:gap-6 justify-between pt-4">
          {chartData.map((d, i) => {
            const height = (d.revenue / maxRev) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-cream text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap z-10 pointer-events-none">
                  €{d.revenue}
                </div>
                {/* Bar */}
                <div 
                  className="w-full bg-mustard border-2 border-foreground shadow-hard-sm rounded-t-xl transition-all duration-500 ease-out group-hover:bg-primary"
                  style={{ height: `${height}%`, minHeight: d.revenue > 0 ? "4px" : "0px" }}
                />
                <span className="text-sm font-bold text-muted-foreground">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
