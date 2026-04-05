import Providers from "@/app/providers";
import Stnavbar from "@/components/Stnavbar";
import { Toaster } from "react-hot-toast";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <Stnavbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-6 pt-24 md:px-6 md:pb-10 md:pt-28">
        <Providers>{children}</Providers>
      </main>
    </div>
  );
}
