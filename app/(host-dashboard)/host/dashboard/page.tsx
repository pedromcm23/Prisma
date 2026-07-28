import { PiggyBank, TrendingUp, MousePointerClick, HeartHandshake, ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";

export default async function HostDashboard() {
  const session = await auth();

  // Mock data for the analytics
  const savings = 450;
  const revenue = 3000;
  
  const chartData = [
    { month: "Jan", revenue: 400 },
    { month: "Feb", revenue: 800 },
    { month: "Mar", revenue: 1200 },
    { month: "Apr", revenue: 2100 },
    { month: "May", revenue: 3000 },
  ];
  const maxRev = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Welcome back, {session?.user?.name?.split(" ")[0]}!</h1>
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
          <p className="text-sm font-bold text-foreground/70 mt-1">vs 15% Airbnb fees</p>
        </div>

        <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Direct Revenue</h2>
          </div>
          <p className="text-4xl font-display font-black">€{revenue}</p>
          <p className="text-sm font-bold text-green-600 mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-1" /> +24% this month
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
          <p className="text-4xl font-display font-black">8</p>
          <p className="text-sm text-muted-foreground font-bold mt-1">Guests claimed perks</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-6">Direct Revenue Growth</h2>
        <div className="h-64 flex items-end gap-2 sm:gap-6 justify-between pt-4">
          {chartData.map((d, i) => {
            const height = (d.revenue / maxRev) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-cream text-xs font-bold px-2 py-1 rounded-md mb-1 whitespace-nowrap">
                  €{d.revenue}
                </div>
                {/* Bar */}
                <div 
                  className="w-full bg-mustard border-2 border-foreground shadow-hard-sm rounded-t-xl transition-all duration-500 ease-out hover:bg-primary"
                  style={{ height: `${height}%` }}
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
