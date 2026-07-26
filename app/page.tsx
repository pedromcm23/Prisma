import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass, Home, ArrowRight, Star, MapPin } from "lucide-react";
import { getProperties } from "@/app/actions/property";
import { auth } from "@/auth";
import { UserNav } from "@/components/user-nav";

export default async function Landing() {
  const latestProperties = await getProperties({ take: 3 });
  const session = await auth();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-2xl font-display font-extrabold">Prisma</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-bold">
          <Link href="/search" className="hover:text-primary">Explore stays</Link>
          <Link href="/host/builder" className="hover:text-primary">For hosts</Link>
          {session?.user ? (
            <UserNav user={session.user} />
          ) : (
            <Link href="/api/auth/signin">
              <Button className="h-9 px-4 rounded-xl bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm font-bold hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-6 text-center">
        <p className="font-hand text-3xl text-accent">welcome to prisma ✿</p>
        <h1 className="mt-2 text-5xl sm:text-7xl font-display font-extrabold leading-[0.95]">
          Two doors,<br className="sm:hidden" /> one home.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
          A hand-crafted little corner of the internet where independent hosts build their story —
          and travelers find stays with actual soul.
        </p>
      </section>

      {/* Split cards */}
      <section className="mx-auto max-w-6xl px-4 pb-16 grid md:grid-cols-2 gap-6">
        <SplitCard
          to="/host/builder"
          badge="I am a Host"
          title="Build my boutique website"
          subtitle="Turn your place into a bookable story in three little steps."
          Icon={Home}
          bg="bg-primary"
          fg="text-primary-foreground"
          bullets={[
            "Direct bookings, zero fees",
            "Inline edit any word or price",
            "Import guest reviews in one click",
          ]}
          cta="Start building"
        />
        <SplitCard
          to="/search"
          badge="I am a Guest"
          title="Discover stays with soul"
          subtitle="Hand-picked boutique hotels & Airbnbs, straight from the hosts."
          Icon={Compass}
          bg="bg-accent"
          fg="text-accent-foreground"
          bullets={[
            "Map & scrollable magazine view",
            "Real neighborhoods, real hosts",
            "Book direct — no middlemen",
          ]}
          cta="Explore stays"
        />
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="font-hand text-2xl text-primary">a little peek</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">Recently added stays</h2>
          </div>
          <Link href="/search" className="font-bold text-sm hover:text-primary inline-flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latestProperties.map((p, i) => (
            <div
              key={p.slug}
              className={`polaroid ${["rotate-[-2deg]", "rotate-[1deg]", "rotate-[-1deg]"][i]}`}
            >
              <div className="tape" />
              <div
                className={`aspect-[5/4] rounded-sm border-2 border-foreground bg-gradient-to-br ${
                  ["from-primary to-mustard", "from-accent to-ocean", "from-mustard to-primary"][i]
                } flex items-end p-3`}
              >
                <div className="bg-white/90 border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-mustard" /> {p.rating}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <p className="font-hand text-xl">{p.name} · {p.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t-2 border-foreground bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl font-extrabold">Prisma</p>
          <p className="font-hand text-lg">made with ♡ for independent hosts</p>
        </div>
      </footer>
    </div>
  );
}

function SplitCard({
  to, badge, title, subtitle, Icon, bg, fg, bullets, cta,
}: {
  to: string;
  badge: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  fg: string;
  bullets: string[];
  cta: string;
}) {
  return (
    <Link
      href={to}
      className={`group ${bg} ${fg} hand-border p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-hard-lg`}
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
      <div className="inline-flex items-center gap-2 self-start bg-white/20 border-2 border-current rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" /> {badge}
      </div>
      <h3 className="mt-6 text-4xl sm:text-5xl font-display font-extrabold leading-tight">{title}</h3>
      <p className="mt-3 opacity-90 max-w-sm">{subtitle}</p>
      <ul className="mt-6 space-y-1.5 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button className="bg-cream text-foreground border-2 border-foreground shadow-hard rounded-xl h-12 px-6 text-base font-bold hover:bg-white group-hover:translate-x-1 transition-transform">
          {cta} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Link>
  );
}
