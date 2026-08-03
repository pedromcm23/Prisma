"use client";

import { useMemo, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isBefore, startOfDay, addYears, isAfter, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toggleBlockedDate, toggleSpontaneousDate } from "@/app/actions/availability";

import { PropertySelector } from "../preview/property-selector";

function getLargestContiguousBlock(blockedDates: string[]): string[] {
  if (blockedDates.length === 0) return [];
  
  const sorted = [...blockedDates].sort();
  let maxBlock: string[] = [];
  let currentBlock: string[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    
    // Check if curr is exactly 1 day after prev
    const nextDay = new Date(prev);
    nextDay.setDate(nextDay.getDate() + 1);
    
    if (curr.toISOString().split('T')[0] === nextDay.toISOString().split('T')[0]) {
      currentBlock.push(sorted[i]);
    } else {
      if (currentBlock.length > maxBlock.length) {
        maxBlock = currentBlock;
      }
      currentBlock = [sorted[i]];
    }
  }
  
  if (currentBlock.length > maxBlock.length) {
    maxBlock = currentBlock;
  }
  
  return maxBlock;
}

export function CalendarPanel({ properties = [], activeId, initialBlocked = [], initialSpontaneous = [], bookedDates = [] }: { properties?: { id: string, name: string }[], activeId?: string, initialBlocked?: string[], initialSpontaneous?: string[], bookedDates?: string[] }) {
  const [blockedDates, setBlockedDates] = useState<string[]>(initialBlocked);
  const [spontaneousDates, setSpontaneousDates] = useState<string[]>(initialSpontaneous);
  const [cursor, setCursor] = useState(() => new Date());

  const days = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    return eachDayOfInterval({ start, end });
  }, [cursor]);
  const leading = getDay(startOfMonth(cursor));

  const iso = (d: Date) => format(d, "yyyy-MM-dd");
  const [focused, setFocused] = useState<string | null>(null);

  const toggleBlocked = async (key: string) => {
    if (!activeId) return;
    
    const wasBlocked = blockedDates.includes(key);
    
    // Optimistic update
    if (wasBlocked) {
      setBlockedDates(prev => prev.filter(d => d !== key));
      setSpontaneousDates(prev => prev.filter(d => d !== key));
    } else {
      setBlockedDates(prev => [...prev, key]);
    }
    
    try {
      await toggleBlockedDate(activeId, new Date(key).toISOString());
    } catch (e) {
      // Revert on error
      if (wasBlocked) {
        setBlockedDates(prev => [...prev, key]);
      } else {
        setBlockedDates(prev => prev.filter(d => d !== key));
      }
    }
  };

  const toggleSpontaneousBundle = async (bundleKeys: string[]) => {
    if (!activeId) return;
    
    const isCurrentlySpontaneous = bundleKeys.every(key => spontaneousDates.includes(key));
    
    // Optimistic update
    if (isCurrentlySpontaneous) {
      setSpontaneousDates(prev => prev.filter(d => !bundleKeys.includes(d)));
    } else {
      setSpontaneousDates(prev => Array.from(new Set([...prev, ...bundleKeys])));
      setBlockedDates(prev => Array.from(new Set([...prev, ...bundleKeys])));
    }
    
    try {
      await Promise.all(bundleKeys.map(key => toggleSpontaneousDate(activeId, new Date(key).toISOString())));
    } catch (e) {
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="mb-6 bg-white p-4 hand-border flex flex-wrap gap-4 items-end justify-between">
        <div>
          <p className="font-hand text-2xl text-accent">availability</p>
          <h2 className="text-3xl font-display font-extrabold">Calendar & Flash Deals</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Click a date to block it. Then toggle "list on Spontaneous Escapes" to push last-minute openings to the guest feed.
          </p>
        </div>
        {properties.length > 0 && (
          <PropertySelector properties={properties} activeId={activeId} basePath="/host/escapes" />
        )}
      </div>

      <div className="hand-border bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCursor((c) => subMonths(c, 1))} className="w-9 h-9 rounded-full border-2 border-foreground shadow-hard-sm hover:bg-mustard/30 flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
          <p className="font-display text-2xl font-extrabold">{format(cursor, "MMMM yyyy")}</p>
          <button 
            onClick={() => setCursor((c) => addMonths(c, 1))} 
            disabled={isAfter(addMonths(cursor, 1), addYears(new Date(), 2))}
            className="w-9 h-9 rounded-full border-2 border-foreground shadow-hard-sm hover:bg-mustard/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
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
            const isBooked = bookedDates.includes(key);
            const isPastDate = isBefore(d, startOfDay(new Date()));
            const isTooFar = isAfter(d, addYears(new Date(), 2));
            const isDisabled = isPastDate || isTooFar;
            const isToday = isSameDay(d, new Date());
            return (
              <button
                key={key}
                disabled={isDisabled || isBooked}
                onClick={() => { toggleBlocked(key); setFocused(key); }}
                className={cn(
                  "relative aspect-square rounded-lg border-2 text-sm font-bold flex flex-col items-center justify-center transition-transform overflow-hidden",
                  (isDisabled || isBooked) ? (isDisabled && !isBooked ? "cursor-not-allowed opacity-60" : "cursor-not-allowed") : "",
                  isBooked ? "bg-foreground text-cream border-foreground" :
                  blocked ? 
                    (isPastDate ? "bg-primary/50 text-primary-foreground border-foreground/30" : "bg-primary text-primary-foreground border-foreground") : 
                    "bg-cream border-foreground",
                  isToday && "border-4",
                )}
              >
                <span className="relative z-10">{format(d, "d")}</span>
                {spont && <Zap className="absolute inset-0 m-auto w-3/4 h-3/4 text-mustard/30 fill-mustard/30 z-0" />}
              </button>
            );
          })}
        </div>

        {focused && (() => {
          let bundle = getLargestContiguousBlock(blockedDates);
          if (bundle.length <= 1) {
            bundle = [focused];
          }
          const isBundleSpontaneous = bundle.every(k => spontaneousDates.includes(k));
          
          // Count only unbooked dates for the bundle display
          const unbookedBundle = bundle.filter(d => !bookedDates.includes(d));
          
          return (
            <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-foreground/40 bg-mustard/20 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  {bundle.length > 1 ? `Largest Bundle: ${bundle.length} nights` : "Focused date"}
                </p>
                <p className="font-display text-xl font-bold">
                  {bundle.length > 1 
                    ? `${format(new Date(bundle[0]), "MMM d")} - ${format(new Date(bundle[bundle.length - 1]), "MMM d, yyyy")}`
                    : format(new Date(focused), "EEE, MMM d, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {bundle.length > 1 
                    ? "Selected uninterrupted blocked dates" 
                    : blockedDates.includes(focused) ? "Blocked from bookings" : "Open for bookings"}
                </p>
              </div>
              <Button
                onClick={() => toggleSpontaneousBundle(bundle)}
                className={cn(
                  "border-2 border-foreground shadow-hard-sm rounded-xl h-11 font-bold",
                  isBundleSpontaneous ? "bg-primary text-primary-foreground" : "bg-cream hover:bg-mustard/30 text-foreground",
                )}
              >
                <Zap className="w-4 h-4 mr-1" />
                {isBundleSpontaneous ? "Listed on Flash Deals" : "List on Flash Deals"}
              </Button>
            </div>
          );
        })()}

        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <Legend swatch="bg-cream border-2 border-foreground" label="Open" />
          <Legend swatch="bg-primary border-2 border-foreground" label="Blocked" />
          <Legend swatch="bg-foreground border-2 border-foreground" label="Booked by Guest" />
          <Legend swatch="bg-cream border-2 border-foreground" icon={<Zap className="w-3 h-3 fill-mustard text-mustard" />} label="Flash Deal" />
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
