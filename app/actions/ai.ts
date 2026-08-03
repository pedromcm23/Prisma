"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function generatePropertyCopy(name: string, location: string) {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      system: `You are an expert luxury hospitality copywriter. You write in English.
Your goal is to help a host create a beautiful, high-converting direct-booking website.
Given the property's name and location, deduce its likely ambiance and generate:
1. A single poetic, sensory-rich tagline (max 10 words). Example: 'A sunlit hideaway on the old cobbled hill'
2. Exactly 3 "specials" (magical ingredients/features) that make guests fall in love. Sensory and concrete always beats generic. Example: 'Homemade sourdough breakfast on the terrace', 'Sunlit terracotta terrace with lemon trees'. Each should be max 10 words.

Be extremely creative, luxurious, and evocative.`,
      prompt: `Property Name: ${name || "A beautiful property"}
Location: ${location || "Unknown Location"}`,
      schema: z.object({
        tagline: z.string().describe("A poetic, sensory tagline"),
        specials: z.array(z.string()).length(3).describe("Exactly 3 magical sensory features"),
      }),
    });

    return { success: true, data: object };
    } catch (error: any) {
    let availableModels = "";
    try {
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (apiKey) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        if (data.models) {
          const names = data.models
            .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
            .map((m: any) => m.name.replace("models/", ""))
            .filter((n: string) => n.includes("gemini"));
          availableModels = ` (Available: ${names.slice(0, 3).join(", ")})`;
        }
      }
    } catch (e) {
      // ignore
    }
    
    return { success: false, error: (error.message || "Failed to generate copy") + availableModels };
  }
}
