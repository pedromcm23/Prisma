import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Users, Search } from "lucide-react";

export default async function AdminHostsPage() {
  const hosts = await prisma.user.findMany({
    where: { role: "HOST" },
    include: {
      _count: {
        select: { properties: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Hosts Management</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage all property hosts across the platform.</p>
      </div>

      <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl overflow-hidden">
        <div className="p-4 border-b-2 border-foreground bg-cream flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" /> All Hosts ({hosts.length})
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search hosts..." 
              className="pl-9 pr-4 py-2 rounded-xl border-2 border-foreground shadow-hard-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-foreground bg-muted/30">
                <th className="p-4 font-bold text-sm">Name / Email</th>
                <th className="p-4 font-bold text-sm">Properties</th>
                <th className="p-4 font-bold text-sm">Joined</th>
                <th className="p-4 font-bold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => (
                <tr key={host.id} className="border-b border-foreground/10 hover:bg-muted/10 transition-colors">
                  <td className="p-4">
                    <p className="font-bold">{host.name || 'Unnamed'}</p>
                    <p className="text-sm text-muted-foreground">{host.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center justify-center bg-mustard px-2 py-1 rounded-full text-xs font-bold border-2 border-foreground">
                      {host._count.properties} units
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(host.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button className="px-3 py-1.5 bg-red-500 text-white font-bold text-xs rounded-lg border-2 border-foreground shadow-hard-sm hover:scale-105 transition-transform">
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
              {hosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No hosts found in the system.
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
