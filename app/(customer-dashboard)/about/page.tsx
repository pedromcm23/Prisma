import { Sparkles, Compass, HeartHandshake } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Prisma",
  description: "The story behind Prisma and the people building it.",
};

const TEAM = [
  { role: "CEO", name: "Pedro Borges", blurb: "Keeps the compass pointed at independent hosts." },
  { role: "CMO", name: "Maddy Hüth", blurb: "Tells the stories that make people book direct." },
  { role: "CTO", name: "Pedro Marques", blurb: "Builds the engine behind every Prisma website." },
  { role: "CDO", name: "Yutong (Ivy) Wei", blurb: "Designs the warmth you feel on every page." },
];

const VALUES = [
  { icon: <Compass className="w-5 h-5" />, title: "Independence first", body: "No middlemen, no commission traps — hosts own their guests and their brand." },
  { icon: <HeartHandshake className="w-5 h-5" />, title: "Hospitality with soul", body: "Small places with big character deserve tools as charming as they are." },
  { icon: <Sparkles className="w-5 h-5" />, title: "Beautiful by default", body: "Every host gets a site that looks designed, not templated." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="font-hand text-3xl text-accent">who we are</p>
      <h1 className="text-4xl sm:text-6xl font-display font-extrabold leading-tight">About Us</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Prisma started in a sunlit kitchen in Lisbon, between four people who kept falling in love
        with small, independent stays — and kept watching their owners hand over a third of their
        income to booking platforms. We build the tools that let boutique hosts own their story,
        their website, and their guests.
      </p>

      <div className="mt-10 grid sm:grid-cols-3 gap-5">
        {VALUES.map((v) => (
          <div key={v.title} className="hand-border bg-white p-5">
            <div className="w-10 h-10 rounded-full bg-mustard border-2 border-foreground shadow-hard-sm flex items-center justify-center">
              {v.icon}
            </div>
            <p className="mt-3 font-display text-xl font-extrabold">{v.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{v.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <p className="font-hand text-2xl text-accent">the people behind it</p>
        <h2 className="text-3xl font-display font-extrabold">Our leadership team</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((m) => (
            <div key={m.name} className="hand-border bg-cream p-5 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm flex items-center justify-center font-display text-2xl font-extrabold">
                {m.name.charAt(0)}
              </div>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{m.role}</p>
              <p className="font-display text-xl font-extrabold leading-tight">{m.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{m.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
