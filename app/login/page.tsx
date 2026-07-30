import { signIn } from "@/auth";
import { Sparkles, X } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { GuestPortal } from "@/components/prisma/GuestPortal";
import { getProperties } from "@/app/actions/property";
import { SAMPLE_LISTINGS } from "@/lib/prisma-types";

export default async function LoginPage() {
  let dbListings = SAMPLE_LISTINGS;
  try {
    const props = await getProperties({ take: 4 });
    if (props && props.length > 0) {
      dbListings = props;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="min-h-screen bg-cream text-foreground relative">
      <AppHeader />
      <GuestPortal listings={dbListings} />
      
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-cream border-2 border-foreground rounded-2xl w-full max-w-md shadow-hard-lg relative flex flex-col items-center text-center p-8">
          <Link href="/" className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-extrabold">Prisma</span>
          </div>

          <h1 className="font-display text-3xl font-extrabold mb-3">Sign in to Prisma</h1>
          <p className="text-sm opacity-80 mb-8 max-w-[260px]">
            One account for guests and hosts. Book direct with independent hosts.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
            className="w-full"
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-foreground rounded-xl h-12 px-4 font-bold hover:bg-gray-50 transition-colors shadow-hard-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-xs opacity-60 mt-6 max-w-[280px]">
            By continuing you agree to Prisma's terms.
          </p>
        </div>
      </div>
    </div>
  );
}
