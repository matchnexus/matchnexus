import Stnavbar from "@/components/Stnavbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Stnavbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-6 pt-24 md:px-6 md:pb-10 md:pt-28">
        {children}
      </main>
    </div>
  );
}
