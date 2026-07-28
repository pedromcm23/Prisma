import { prisma } from "@/lib/prisma";
import { FileText, Search } from "lucide-react";

export default async function AdminPagesPage() {
  const properties = await prisma.property.findMany({
    include: {
      host: true,
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Landing Pages</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage and moderate all property landing pages.</p>
      </div>

      <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl overflow-hidden">
        <div className="p-4 border-b-2 border-foreground bg-cream flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" /> All Pages ({properties.length})
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search pages..." 
              className="pl-9 pr-4 py-2 rounded-xl border-2 border-foreground shadow-hard-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-foreground bg-muted/30">
                <th className="p-4 font-bold text-sm">Property Name</th>
                <th className="p-4 font-bold text-sm">Host</th>
                <th className="p-4 font-bold text-sm">Bookings</th>
                <th className="p-4 font-bold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="border-b border-foreground/10 hover:bg-muted/10 transition-colors">
                  <td className="p-4">
                    <p className="font-bold">{prop.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{prop.description || 'No description'}</p>
                  </td>
                  <td className="p-4 text-sm">
                    {prop.host.name || prop.host.email}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center justify-center bg-green-200 px-2 py-1 rounded-full text-xs font-bold border-2 border-foreground">
                      {prop._count.bookings}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-white font-bold text-xs rounded-lg border-2 border-foreground shadow-hard-sm hover:scale-105 transition-transform">
                        View
                      </button>
                      <button className="px-3 py-1.5 bg-red-500 text-white font-bold text-xs rounded-lg border-2 border-foreground shadow-hard-sm hover:scale-105 transition-transform">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No landing pages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
