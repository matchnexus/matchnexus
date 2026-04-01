import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "MatchNexus",
  description: "MatchNexus Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
