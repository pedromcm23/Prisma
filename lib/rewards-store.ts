import { useEffect, useState, useCallback } from "react";

export type GuestBooking = {
  id: string;
  stay: string;
  location: string;
  photo: string;
  room: string;
  from: string;
  to: string;
  total: number;
  when: "past" | "current" | "upcoming";
  shared: boolean;
  pointsAwarded: boolean;
};

type RewardsState = {
  bookings: GuestBooking[];
  redeemed: number;
};

const KEY = "prisma.rewards.v1";
const EVT = "prisma-rewards-change";

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const POINTS_PER_STAY = 100;
export const POINTS_SHARED_BONUS = 100;
export const REDEEM_THRESHOLD = 1000;
export const COUPON_VALUE = 50;

const seed = (): RewardsState => ({
  redeemed: 0,
  bookings: [],
});

function read(initialBookings?: GuestBooking[]): RewardsState {
  if (typeof window === "undefined") return { redeemed: 0, bookings: initialBookings || [] };
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    
    const state: RewardsState = {
      redeemed: parsed?.redeemed || 0,
      bookings: initialBookings || [],
    };
    
    // Merge shared status from localStorage
    if (parsed && parsed.bookings) {
      state.bookings = state.bookings.map(b => {
        const localB = parsed.bookings.find((lb: any) => lb.id === b.id);
        if (localB && localB.shared) {
          return { ...b, shared: true };
        }
        return b;
      });
    }
    
    return state;
  } catch {
    return { redeemed: 0, bookings: initialBookings || [] };
  }
}

function write(s: RewardsState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function pointsFor(b: GuestBooking) {
  if (!b.pointsAwarded) return 0;
  return POINTS_PER_STAY + (b.shared ? POINTS_SHARED_BONUS : 0);
}

export function useRewards(initialBookings?: GuestBooking[]) {
  const [state, setState] = useState<RewardsState>(() => read(initialBookings));
  useEffect(() => {
    // Force a read on mount to sync with localStorage in case it wasn't available during SSR
    setState(read(initialBookings));
    
    const sync = () => setState(read(initialBookings));
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [initialBookings]);

  const earned = state.bookings.reduce((n, b) => n + pointsFor(b), 0);
  const balance = earned - state.redeemed * REDEEM_THRESHOLD;

  const markShared = useCallback((id: string) => {
    const s = read();
    s.bookings = s.bookings.map((b) => (b.id === id ? { ...b, shared: true } : b));
    write(s);
  }, []);

  const redeem = useCallback(() => {
    const s = read();
    s.redeemed += 1;
    write(s);
  }, []);

  return { ...state, earned, balance, markShared, redeem };
}
