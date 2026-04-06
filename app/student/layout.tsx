import StudentHubNavbar from "@/components/StudentHubNavbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "linear-gradient(160deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)" }} className="min-h-screen">
      <StudentHubNavbar />
      <main>{children}</main>
    </div>
  );
}
