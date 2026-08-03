"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { type Listing } from "@/lib/prisma-types";
import { GoogleMap, useLoadScript, OverlayViewF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
};

export default function GoogleMapView({ listings, onOpen }: { listings: Listing[]; onOpen: (l: Listing) => void }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const defaultCenter = useMemo(() => ({ lat: 38.7223, lng: -9.1393 }), []);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit bounds when listings change
  useEffect(() => {
    if (map && listings.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoords = false;
      listings.forEach((l) => {
        if (l.lat && l.lng) {
          bounds.extend({ lat: l.lat, lng: l.lng });
          hasValidCoords = true;
        }
      });
      if (hasValidCoords) {
        map.fitBounds(bounds);
        // Prevent zooming in too close
        const listener = window.google.maps.event.addListener(map, "idle", () => {
          if (map.getZoom()! > 14) map.setZoom(14);
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [map, listings]);

  if (!isLoaded) {
    return <div className="w-full aspect-[16/10] rounded-2xl border-2 border-foreground shadow-hard-lg bg-cream flex items-center justify-center animate-pulse" />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="relative w-full aspect-[16/10] rounded-2xl border-2 border-foreground shadow-hard-lg overflow-hidden bg-cream z-10">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={5}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {listings.map((l) => {
            const lat = l.lat || (Math.random() * 10 + 35); // fallback
            const lng = l.lng || (Math.random() * 20 - 10);
            return (
              <OverlayViewF
                key={l.slug}
                position={{ lat, lng }}
                mapPaneName="overlayMouseTarget"
              >
                <div 
                  onClick={() => onOpen(l)}
                  className="absolute cursor-pointer flex flex-col items-center hover:-translate-y-1 transition-transform"
                  style={{ transform: "translate(-50%, -100%)" }}
                >
                  <div className="bg-primary text-primary-foreground border-2 border-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full px-2.5 py-1 text-xs font-extrabold whitespace-nowrap">
                    €{l.price}
                  </div>
                  <div className="w-2.5 h-2.5 bg-primary border-r-2 border-b-2 border-foreground transform rotate-45 -mt-1.5 z-[-1]"></div>
                </div>
              </OverlayViewF>
            );
          })}
        </GoogleMap>
      </div>
      <p className="mt-4 text-sm text-muted-foreground text-center font-hand text-xl">
        tap a pin to peek inside ✿
      </p>
    </section>
  );
}
