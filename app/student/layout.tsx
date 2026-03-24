import StudentHubNavbar from "@/components/StudentHubNavbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <StudentHubNavbar />
      <main>{children}</main>
    </div>
  );
}
