"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, Search, BookOpen, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserNav({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}) {
  const pathname = usePathname();
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";
    
  const isHostRole = user.role === "HOST";
  const isHostContext = pathname?.startsWith("/host");

  return (
    <div className="flex items-center gap-3">
      {/* Context Badge */}
      <div className={cn(
        "hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-foreground shadow-hard-sm text-xs font-bold uppercase tracking-wider",
        isHostContext ? "bg-primary text-primary-foreground" : "bg-ocean text-white"
      )}>
        {isHostContext ? "Host Mode" : "Guest Mode"}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative w-11 h-11 rounded-full border-2 border-foreground shadow-hard-sm overflow-hidden hover:scale-105 transition-transform bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Avatar className="w-full h-full">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? "User avatar"} />
              <AvatarFallback className="bg-mustard text-ink font-bold">{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-cream border-2 border-foreground shadow-hard" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold font-display leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-foreground/20" />
          
          {isHostRole ? (
            <>
              {isHostContext ? (
                <DropdownMenuItem asChild className="font-bold cursor-pointer focus:bg-mustard/30">
                  <Link href="/search">
                    <Search className="mr-2 h-4 w-4" />
                    <span>Switch to Guest Mode</span>
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild className="font-bold cursor-pointer focus:bg-mustard/30">
                  <Link href="/host/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Switch to Host Mode</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </>
          ) : (
            <>
              <DropdownMenuItem asChild className="font-bold cursor-pointer focus:bg-mustard/30">
                <Link href="/customer/bookings">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="font-bold cursor-pointer focus:bg-mustard/30">
                <Link href="/host/builder">
                  <Hammer className="mr-2 h-4 w-4" />
                  <span>Become a Host</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator className="bg-foreground/20" />
          <DropdownMenuItem
            className="text-red-600 font-bold cursor-pointer focus:bg-red-50 focus:text-red-700"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
