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
  bookings: [
    {
      id: "g1", stay: "Casa Amarela", location: "Alfama, Lisbon", photo: U("photo-1566073771259-6a8506099945"),
      room: "Garden Room", from: "2026-03-04", to: "2026-03-08", total: 592,
      when: "past", shared: true, pointsAwarded: true,
    },
    {
      id: "g2", stay: "Riad Nour", location: "Medina, Marrakech", photo: U("photo-1539020140153-e479b8c22e70"),
      room: "Courtyard Room", from: "2026-05-11", to: "2026-05-14", total: 396,
      when: "past", shared: false, pointsAwarded: true,
    },
    {
      id: "g3", stay: "Villa Fiore", location: "Ostuni, Puglia", photo: U("photo-1499793983690-e29da59ef1c2"),
      room: "Trullo Suite", from: "2026-06-02", to: "2026-06-09", total: 1365,
      when: "past", shared: true, pointsAwarded: true,
    },
    {
      id: "g4", stay: "Casita Limón", location: "Cadaqués, Spain", photo: U("photo-1512917774080-9991f1c4c750"),
      room: "Lemon Loft", from: "2026-07-28", to: "2026-08-02", total: 875,
      when: "current", shared: false, pointsAwarded: false,
    },
    {
      id: "g5", stay: "Olive Hill Retreat", location: "Chania, Crete", photo: U("photo-1582719478250-c89cae4dc85b"),
      room: "Fig Tree Loft", from: "2026-09-15", to: "2026-09-20", total: 1050,
      when: "upcoming", shared: false, pointsAwarded: false,
    },
  ],
});

function read(): RewardsState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
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

export function useRewards() {
  const [state, setState] = useState<RewardsState>(() => read());
  useEffect(() => {
    const sync = () => setState(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

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
