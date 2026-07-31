"use client";
import { useState } from "react";
import type { PropertyData } from "@/lib/prisma-types";
import { Calendar } from "@/components/ui/calendar";
import { createBooking } from "@/app/actions/booking";
import type { DateRange } from "react-day-picker";
import { differenceInDays, parseISO, format } from "date-fns";

export function HotelWebsite({ data, propertyId, unavailableDates = [] }: { data: PropertyData, propertyId: string, unavailableDates?: string[] }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [room, setRoom] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabledDays = [
    { before: new Date() },
    ...unavailableDates.map(d => parseISO(d))
  ];

  const rooms = data.rooms && data.rooms.length > 0 ? data.rooms : [
    { name: "Signature Room", price: data.basePrice || 150, amenities: ["WiFi", "AC"], photos: [] }
  ];
  const selectedRoomPrice = rooms[room]?.price || data.basePrice || 150;
  
  const nights = dateRange?.from && dateRange?.to ? Math.max(1, differenceInDays(dateRange.to, dateRange.from)) : 0;
  const total = selectedRoomPrice * nights;
  
  const allPhotos = data.rooms?.flatMap((r) => r.photos).filter(Boolean) || [];
  const heroImage = allPhotos[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop";
  const gallery = allPhotos.slice(0, 4);
  
  // Backfill gallery if we don't have enough photos
  while (gallery.length < 4) {
    gallery.push(heroImage);
  }

  return (
    <div
      className="hw relative"
      style={{
        ["--hw-ink" as string]: "#141414",
        ["--hw-linen" as string]: "#F4F1EC",
        ["--hw-paper" as string]: "#FFFFFF",
        ["--hw-muted" as string]: "#6E6A64",
        ["--hw-line" as string]: "rgba(20,20,20,0.14)",
        background: "var(--hw-linen)",
        color: "var(--hw-ink)",
        fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-center sm:justify-between px-6 sm:px-10 h-16 pt-16 sm:pt-0"
        style={{ borderBottom: "1px solid var(--hw-line)" }}
      >
        <span
          className="text-lg tracking-[0.32em] uppercase text-center sm:text-left w-full sm:w-auto"
          style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}
        >
          {data.name}
        </span>
        <div className="hidden sm:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--hw-muted)" }}>
          <a href="#rooms" className="hover:opacity-60 transition-opacity">Rooms</a>
          <a href="#story" className="hover:opacity-60 transition-opacity">The House</a>
          <a href="#place" className="hover:opacity-60 transition-opacity">The Place</a>
          <a href="#book" className="hover:opacity-60 transition-opacity">Reserve</a>
        </div>
      </nav>

      {/* Full-bleed hero */}
      <header className="relative h-[72vh] min-h-[440px] w-full overflow-hidden">
        <img src={heroImage} alt={`${data.name}, ${data.location}`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55))" }} />
        <div className="relative h-full flex flex-col justify-end px-6 sm:px-10 pb-12" style={{ color: "#fff" }}>
          <p className="text-[11px] uppercase tracking-[0.35em] opacity-85">{data.location}</p>
          <h1
            className="mt-3 text-5xl sm:text-7xl leading-[0.95] max-w-3xl"
            style={{ fontFamily: "'Bodoni Moda', Georgia, serif", fontWeight: 400 }}
          >
            {data.tagline || "A hand-made little world, ready for your arrival."}
          </h1>
          <p className="mt-5 text-sm max-w-md opacity-90 leading-relaxed">
            An independent house of {rooms.length} rooms, kept by {data.hostName || "your host"}.
            Reserve directly — no platform fees, no intermediaries.
          </p>
        </div>
      </header>

      {/* Story */}
      <section id="story" className="px-6 sm:px-10 py-20 grid md:grid-cols-12 gap-10 max-w-6xl mx-auto">
        <div className="md:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--hw-muted)" }}>The House</p>
        </div>
        <div className="md:col-span-8">
          <p className="text-2xl sm:text-3xl leading-snug" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>
            {data.name} sits in {data.location} — restored slowly, room by room,
            with lime plaster, salvaged shutters and the kind of light you plan a day around.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-8">
            {(data.specials?.length ? data.specials : ["Considered, understated, and entirely part of the house.", "A quiet space to read, write, or just be.", "The kind of place that feels like yours."]).slice(0, 3).map((t, i) => (
              <div key={i} style={{ borderTop: "1px solid var(--hw-line)" }} className="pt-4">
                <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: "var(--hw-muted)" }}>Detail 0{i + 1}</p>
                <p className="mt-2 text-sm leading-relaxed">
                  {t || "Considered, understated, and entirely part of the house."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {gallery.map((g, i) => (
          <img key={i} src={g} alt={`${data.name} interior ${i + 1}`} loading="lazy" className="w-full aspect-[4/5] object-cover" />
        ))}
      </section>

      {/* Rooms */}
      <section id="rooms" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--hw-muted)" }}>Rooms</p>
        <div className="mt-8 grid md:grid-cols-3 gap-8">
          {rooms.map((r: any, i) => (
            <button
              key={r.name + i}
              onClick={() => setRoom(i)}
              className="text-left overflow-hidden transition-all"
              style={{
                background: "var(--hw-paper)",
                border: `1px solid ${i === room ? "var(--hw-ink)" : "var(--hw-line)"}`,
              }}
            >
              <img src={r.photos?.[0] || heroImage} alt={r.name} loading="lazy" className="w-full aspect-[3/2] object-cover" />
              <div className="p-6">
                <h3 className="text-2xl" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>{r.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--hw-muted)" }}>
                  {r.amenities?.slice(0,2).join(" · ") || "Cozy room"}
                </p>
                <p className="mt-4 text-lg">€{r.price} <span className="text-xs" style={{ color: "var(--hw-muted)" }}>/ night</span></p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Place */}
      <section id="place" className="px-6 sm:px-10 py-20" style={{ background: "var(--hw-paper)", borderTop: "1px solid var(--hw-line)", borderBottom: "1px solid var(--hw-line)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--hw-muted)" }}>The Place</p>
            <h2 className="mt-4 text-4xl" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>{data.location.split(',')[0]}</h2>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {(data.directions?.length && data.directions.some(d => d.trim() !== "") ? data.directions.filter(d => d.trim() !== "") : [
              "Five minutes on foot to the morning market",
              "A quiet swimming cove most visitors walk past",
              "The wine bar our neighbours actually go to",
              "Sunset from the terrace, every evening at eight",
            ]).slice(0, 4).map((line, i) => (
              <div key={i} className="flex gap-4" style={{ borderTop: "1px solid var(--hw-line)" }}>
                <span className="pt-4 text-[11px]" style={{ color: "var(--hw-muted)" }}>0{i + 1}</span>
                <p className="pt-4 text-sm leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--hw-muted)" }}>Reserve</p>
          <h2 className="mt-4 text-4xl leading-tight" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>
            Booking direct is always the better rate.
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--hw-muted)" }}>
            Rated 4.9 by guests. Written to and answered by {data.hostName || "your host"} personally.
          </p>
        </div>
        <div className="md:col-span-7" style={{ background: "var(--hw-paper)", border: "1px solid var(--hw-line)" }}>
          <div className="p-8">
            <div className="flex items-center justify-between" style={{ borderBottom: "1px solid var(--hw-line)", paddingBottom: 16 }}>
              <span className="text-sm">{rooms[room]?.name}</span>
              <span className="text-sm">€{selectedRoomPrice} / night</span>
            </div>
            <div className="py-6 border-b" style={{ borderColor: "var(--hw-line)" }}>
              <span className="text-[11px] uppercase tracking-[0.24em] mb-4 block" style={{ color: "var(--hw-muted)" }}>Select Dates</span>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                disabled={disabledDays}
                numberOfMonths={1}
                className="p-0 flex justify-center"
              />
            </div>
            
            <div className="flex items-baseline justify-between" style={{ paddingTop: 16 }}>
              <span className="text-[11px] uppercase tracking-[0.24em]" style={{ color: "var(--hw-muted)" }}>Total ({nights} nights)</span>
              <span className="text-3xl" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>€{total}</span>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
            )}

            {bookingSuccess ? (
              <div className="mt-6 w-full h-14 flex items-center justify-center text-[11px] uppercase tracking-[0.3em] bg-green-600 text-white">
                Reservation Confirmed
              </div>
            ) : (
              <button
                onClick={async () => {
                  if (!dateRange?.from || !dateRange?.to) {
                    setError("Please select check-in and check-out dates");
                    return;
                  }
                  setError(null);
                  setIsBooking(true);
                  try {
                    await createBooking(
                      propertyId, 
                      format(dateRange.from, "yyyy-MM-dd"), 
                      format(dateRange.to, "yyyy-MM-dd"), 
                      total
                    );
                    setBookingSuccess(true);
                  } catch (e: any) {
                    setError(e.message || "Failed to create reservation");
                  } finally {
                    setIsBooking(false);
                  }
                }}
                disabled={!dateRange?.from || !dateRange?.to || isBooking}
                className="mt-6 w-full h-14 text-[11px] uppercase tracking-[0.3em] transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--hw-ink)", color: "var(--hw-linen)" }}
              >
                {isBooking ? "Confirming..." : "Request this reservation"}
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-10 py-12" style={{ borderTop: "1px solid var(--hw-line)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em]" style={{ color: "var(--hw-muted)" }}>
          <span style={{ fontFamily: "'Bodoni Moda', Georgia, serif", letterSpacing: "0.3em" }}>{data.name}</span>
          <span>{data.location}</span>
          <span>Independently operated</span>
        </div>
      </footer>
    </div>
  );
}
