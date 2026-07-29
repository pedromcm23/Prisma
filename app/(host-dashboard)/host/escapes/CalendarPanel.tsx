"use client";

import { useMemo, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CalendarPanel() {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [spontaneousDates, setSpontaneousDates] = useState<string[]>([]);
  const [cursor, setCursor] = useState(() => new Date());

  const days = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    return eachDayOfInterval({ start, end });
  }, [cursor]);
  const leading = getDay(startOfMonth(cursor));

  const iso = (d: Date) => format(d, "yyyy-MM-dd");
  const [focused, setFocused] = useState<string | null>(null);

  const toggleBlocked = (key: string) => {
    if (blockedDates.includes(key)) {
      setBlockedDates(prev => prev.filter(d => d !== key));
      setSpontaneousDates(prev => prev.filter(d => d !== key));
    } else {
      setBlockedDates(prev => [...prev, key]);
    }
  };

  const toggleSpontaneous = (key: string) => {
    if (spontaneousDates.includes(key)) {
      setSpontaneousDates(prev => prev.filter(d => d !== key));
    } else {
      setSpontaneousDates(prev => [...prev, key]);
      if (!blockedDates.includes(key)) {
        setBlockedDates(prev => [...prev, key]); // ensure it's blocked from regular bookings
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="font-hand text-2xl text-accent">availability</p>
        <h2 className="text-3xl font-display font-extrabold">Calendar & Spontaneous Escapes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click a date to block it. Then toggle "list on Spontaneous Escapes" to push last-minute openings to the guest feed.
        </p>
      </div>

      <div className="hand-border bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCursor((c) => subMonths(c, 1))} className="w-9 h-9 rounded-full border-2 border-foreground shadow-hard-sm hover:bg-mustard/30 flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
          <p className="font-display text-2xl font-extrabold">{format(cursor, "MMMM yyyy")}</p>
          <button onClick={() => setCursor((c) => addMonths(c, 1))} className="w-9 h-9 rounded-full border-2 border-foreground shadow-hard-sm hover:bg-mustard/30 flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leading }).map((_, i) => <div key={`p-${i}`} />)}
          {days.map((d) => {
            const key = iso(d);
            const blocked = blockedDates.includes(key);
            const spont = spontaneousDates.includes(key);
            return (
              <button
                key={key}
                onClick={() => { toggleBlocked(key); setFocused(key); }}
                className={cn(
                  "relative aspect-square rounded-lg border-2 border-foreground text-sm font-bold flex flex-col items-center justify-center transition-transform",
                  blocked ? "bg-primary text-primary-foreground" : "bg-cream hover:bg-mustard/30",
                  isSameDay(d, new Date()) && "ring-2 ring-accent",
                )}
              >
                {format(d, "d")}
                {spont && <Zap className="absolute top-0.5 right-0.5 w-3 h-3 text-mustard fill-mustard" />}
              </button>
            );
          })}
        </div>

        {focused && (
          <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-foreground/40 bg-mustard/20 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Focused date</p>
              <p className="font-display text-xl font-bold">{format(new Date(focused), "EEE, MMM d, yyyy")}</p>
              <p className="text-xs text-muted-foreground">
                {blockedDates.includes(focused) ? "Blocked from bookings" : "Open for bookings"}
              </p>
            </div>
            <Button
              onClick={() => toggleSpontaneous(focused)}
              className={cn(
                "border-2 border-foreground shadow-hard-sm rounded-xl h-11 font-bold",
                spontaneousDates.includes(focused) ? "bg-primary text-primary-foreground" : "bg-cream hover:bg-mustard/30 text-foreground",
              )}
            >
              <Zap className="w-4 h-4 mr-1" />
              {spontaneousDates.includes(focused) ? "Listed on Spontaneous Escapes" : "List on Spontaneous Escapes"}
            </Button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <Legend swatch="bg-cream border-2 border-foreground" label="Open" />
          <Legend swatch="bg-primary border-2 border-foreground" label="Blocked" />
          <Legend swatch="bg-cream border-2 border-foreground" icon={<Zap className="w-3 h-3 fill-mustard text-mustard" />} label="Listed as Spontaneous Escape" />
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label, icon }: { swatch: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={cn("w-4 h-4 rounded relative flex items-center justify-center", swatch)}>{icon}</span>
      <span className="font-bold">{label}</span>
    </div>
  );
}
