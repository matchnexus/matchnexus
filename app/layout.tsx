import "./globals.css";
import type { Metadata } from "next";
import NavbarMain from "@/components/NavbarMain";
import FooterMain from "@/components/FooterMain";

export const metadata: Metadata = {
  title: "MatchNexus",
  description: "ML-powered internship matching platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
      
        <NavbarMain />
        <main className="w-full">{children}</main>
        <FooterMain />
      </body>
    </html>
  );
}
