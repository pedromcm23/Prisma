"use client";

import { useState } from "react";
import { cancelBooking } from "@/app/actions/booking";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel and delete this reservation?")) return;
    
    setIsCanceling(true);
    try {
      await cancelBooking(bookingId);
      toast.success("Reservation cancelled successfully");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel");
      setIsCanceling(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isCanceling}
      title="Cancel Reservation"
      className="ml-3 p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
