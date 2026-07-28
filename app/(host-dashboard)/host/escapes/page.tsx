"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Share, Calendar, Percent } from "lucide-react";
import { BrandExportModal } from "@/components/prisma/BrandExportModal";
import { themeToBrandKit } from "@/lib/brand-kit";
import { emptyData } from "@/lib/prisma-types";

export default function EscapesPage() {
  const [openExport, setOpenExport] = useState(false);
  const [discount, setDiscount] = useState("20");
  
  // Dummy data for the modal to use
  const dummyKit = themeToBrandKit("folk-pop");
  const dummyData = emptyData();
  dummyData.name = "My Boutique Property";
  dummyData.rooms = [{ name: "Standard", price: 150, amenities: [], photos: [] }];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Spontaneous Escapes</h1>
        <p className="text-muted-foreground mt-2 text-lg">Turn empty nights into fully booked weekends with flash deals.</p>
      </div>

      <div className="bg-mustard/20 border-2 border-foreground shadow-hard rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center border-2 border-foreground shadow-hard-sm">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Create a Flash Deal</h2>
            <p className="text-muted-foreground font-medium">Generate a ready-to-post Instagram Story.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <Label className="font-bold">Select Dates</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input placeholder="e.g. This Weekend" className="pl-10 h-12 border-2 border-foreground rounded-xl font-bold" />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="font-bold">Discount Percentage</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input 
                type="number" 
                value={discount} 
                onChange={(e) => setDiscount(e.target.value)} 
                className="pl-10 h-12 border-2 border-foreground rounded-xl font-bold" 
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={() => setOpenExport(true)}
          className="w-full h-14 text-lg bg-primary text-primary-foreground border-2 border-foreground shadow-hard hover:bg-primary/90 transition-transform hover:-translate-y-1 rounded-xl font-bold"
        >
          <Share className="w-5 h-5 mr-2" />
          Generate Story for Instagram
        </Button>
      </div>

      <BrandExportModal 
        open={openExport} 
        onOpenChange={setOpenExport} 
        kit={dummyKit} 
        data={dummyData} 
        shareUrl="https://prisma.so/stay/demo" 
      />
    </div>
  );
}
