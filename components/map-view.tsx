"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { type Listing } from "@/lib/prisma-types";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix leaflet default icon issue in Next.js
const customIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="background-color: var(--primary); color: var(--primary-foreground); border: 2px solid var(--foreground); box-shadow: 4px 4px 0px rgba(0,0,0,1); border-radius: 9999px; padding: 4px 12px; font-size: 12px; font-weight: 900; white-space: nowrap; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center;">
          <span class="price-label"></span>
          <div style="width: 12px; height: 12px; background-color: var(--primary); border-right: 2px solid var(--foreground); border-bottom: 2px solid var(--foreground); transform: rotate(45deg); margin-top: -6px; margin-bottom: -6px;"></div>
         </div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

export default function LeafletMapView({ listings, onOpen }: { listings: Listing[]; onOpen: (l: Listing) => void }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full aspect-[16/10] rounded-2xl border-2 border-foreground shadow-hard-lg bg-cream flex items-center justify-center animate-pulse" />;
  }

  // Calculate bounds or use a default center (e.g., Lisbon)
  const defaultCenter: [number, number] = [38.7223, -9.1393];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="relative w-full aspect-[16/10] rounded-2xl border-2 border-foreground shadow-hard-lg overflow-hidden bg-cream z-10">
        <MapContainer 
          center={defaultCenter} 
          zoom={5} 
          scrollWheelZoom={false}
          className="w-full h-full"
          style={{ background: "#F5F2EA" }} // cream
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapBounds listings={listings} />
          
          {listings.map((l) => {
            // we will create a dynamic div icon for each listing to show the price
            const priceIcon = L.divIcon({
              className: "custom-leaflet-icon",
              html: `<div style="background-color: #FA5246; color: white; border: 2px solid #1c1c1c; box-shadow: 2px 2px 0px rgba(28,28,28,1); border-radius: 9999px; padding: 4px 10px; font-size: 12px; font-weight: 800; white-space: nowrap; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;">
                      <span>€${l.price}</span>
                      <div style="width: 8px; height: 8px; background-color: #FA5246; border-right: 2px solid #1c1c1c; border-bottom: 2px solid #1c1c1c; transform: rotate(45deg); margin-top: 1px; margin-bottom: -5px;"></div>
                     </div>`,
              iconSize: [0, 0],
              iconAnchor: [0, 0], // Center bottom
            });

            // Fallback for listings that don't have lat/lng
            const lat = l.lat || (Math.random() * 10 + 35); // random around southern europe
            const lng = l.lng || (Math.random() * 20 - 10);

            return (
              <Marker 
                key={l.slug} 
                position={[lat, lng]} 
                icon={priceIcon}
                eventHandlers={{
                  click: () => onOpen(l),
                }}
              >
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <p className="mt-4 text-sm text-muted-foreground text-center font-hand text-xl">
        tap a pin to peek inside ✿
      </p>
    </section>
  );
}

// Helper component to auto-fit map bounds to listings
function MapBounds({ listings }: { listings: Listing[] }) {
  const map = useMap();

  useEffect(() => {
    if (listings.length > 0) {
      const bounds = L.latLngBounds(
        listings.map((l) => [l.lat || 38, l.lng || -9])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [listings, map]);

  return null;
}
