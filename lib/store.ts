import type { PropertyData } from "./prisma-types";

// In-memory store to avoid Safari sessionStorage crashes with large base64 strings
export const globalDraftStore: Record<string, PropertyData> = {};
