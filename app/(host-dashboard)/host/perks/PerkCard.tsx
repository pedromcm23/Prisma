"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approvePerk } from "./actions";
import { ExternalLink, Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function PerkCard({ perk }: { perk: any }) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(perk.code);

  const isApproved = perk.status === "approved";

  async function handleApprove() {
    setLoading(true);
    try {
      const newCode = await approvePerk(perk.id);
      setCode(newCode);
      toast.success("Perk approved! Code generated.");
    } catch (e) {
      toast.error("Failed to approve perk");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  }

  // Check if postUrl is an image URL to render it inline
  const isImage = perk.postUrl.match(/\.(jpeg|jpg|gif|png)$/i) || perk.postUrl.includes("unsplash.com");

  return (
    <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl overflow-hidden flex flex-col">
      {isImage ? (
        <div 
          className="h-48 bg-cover bg-center border-b-2 border-foreground bg-mustard"
          style={{ backgroundImage: `url(${perk.postUrl})` }}
        />
      ) : (
        <div className="h-48 bg-mustard/30 border-b-2 border-foreground flex items-center justify-center p-4">
          <a href={perk.postUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-bold underline">
            View Post <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-extrabold text-xl leading-tight">{perk.guestName}</h3>
          <span className="text-xs font-bold text-muted-foreground">{new Date(perk.createdAt).toLocaleDateString()}</span>
        </div>
        
        <p className="text-sm font-bold text-primary mb-3">{perk.stayName}</p>
        
        {perk.note && (
          <div className="bg-cream border-2 border-dashed border-foreground/40 rounded-xl p-3 mb-4 text-sm font-hand text-muted-foreground flex-1">
            "{perk.note}"
          </div>
        )}

        <div className="mt-auto pt-2">
          {isApproved ? (
            <div className="bg-green-100 border-2 border-green-800 text-green-900 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block mb-0.5">Reward Code</span>
                <span className="font-display font-bold text-lg">{code}</span>
              </div>
              <button onClick={copyCode} className="p-2 hover:bg-green-200 rounded-full transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button 
              onClick={handleApprove}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm font-bold rounded-xl hover:bg-primary/90"
            >
              {loading ? "Approving..." : "Approve & Send €15"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
