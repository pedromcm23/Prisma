import { auth } from "@/auth";
import { CalendarPanel } from "./CalendarPanel";

export default async function FlashDeals() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  return (
    <CalendarPanel />
  );
}
