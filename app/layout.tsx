import type { Metadata } from "next";
import { Fraunces, Caveat, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const fraunces = Fraunces({ 
  subsets: ["latin"], 
  variable: "--font-fraunces",
  display: "swap",
});

const caveat = Caveat({ 
  subsets: ["latin"], 
  variable: "--font-caveat",
  display: "swap",
});

const nunito = Nunito({ 
  subsets: ["latin"], 
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prisma — Boutique stays with soul",
  description: "Two doors, one home. Build your boutique website as a host, or discover hand-picked stays as a guest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${nunito.variable} ${caveat.variable} antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
