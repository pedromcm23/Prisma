"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveTransaction } from "@/app/actions/rewards";
import { ExternalLink, Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function PerkCard({ transaction }: { transaction: any }) {
  const [loading, setLoading] = useState(false);
  
  // transaction.status could be changed locally without refreshing right away
  const [isApproved, setIsApproved] = useState(transaction.status === "APPROVED");

  async function handleApprove() {
    setLoading(true);
    try {
      await approveTransaction(transaction.id);
      setIsApproved(true);
      toast.success("Perk approved! 250 points awarded to guest.");
    } catch (e: any) {
      toast.error(e.message || "Failed to approve perk");
    } finally {
      setLoading(false);
    }
  }

  // Check if note is an image URL to render it inline
  const postUrl = transaction.note || "";
  const isImage = postUrl.match(/\.(jpeg|jpg|gif|png)$/i) || postUrl.includes("unsplash.com");

  return (
    <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl overflow-hidden flex flex-col">
      {isImage ? (
        <div 
          className="h-48 bg-cover bg-center border-b-2 border-foreground bg-mustard"
          style={{ backgroundImage: `url(${postUrl})` }}
        />
      ) : (
        <div className="h-48 bg-mustard/30 border-b-2 border-foreground flex items-center justify-center p-4">
          <a href={postUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-bold underline text-center break-all">
            View Post Link <ExternalLink className="w-4 h-4 shrink-0" />
          </a>
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-extrabold text-xl leading-tight">{transaction.user?.name || "Guest"}</h3>
          <span className="text-xs font-bold text-muted-foreground">{new Date(transaction.createdAt).toLocaleDateString()}</span>
        </div>
        
        <p className="text-sm font-bold text-primary mb-3">Pending Social Submission</p>

        <div className="mt-auto pt-2">
          {isApproved ? (
            <div className="bg-green-100 border-2 border-green-800 text-green-900 rounded-xl p-3 flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span className="font-bold">Approved & Awarded (250 pts)</span>
            </div>
          ) : (
            <Button 
              onClick={handleApprove}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm font-bold rounded-xl hover:bg-primary/90"
            >
              {loading ? "Approving..." : "Approve Marketing (250 pts)"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
