"use client";

import { useRouter } from "next/navigation";

export function PropertySelector({ properties, activeId, basePath }: { properties: { id: string, name: string }[], activeId?: string, basePath: string }) {
  const router = useRouter();
  
  if (properties.length === 0) return null;
  
  return (
    <select 
      value={activeId || ""}
      onChange={(e) => window.location.href = `${basePath}?id=${e.target.value}`}
      className="ml-auto text-sm border-2 border-foreground shadow-hard-sm rounded-lg h-8 px-2 font-bold bg-white"
    >
      {properties.map(p => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  );
}
