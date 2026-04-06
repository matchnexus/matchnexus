import StudentHubNavbar from "@/components/StudentHubNavbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-base" style={{ backgroundColor: "#F8FBFF" }}>
      <StudentHubNavbar />
      <main>{children}</main>
    </div>
  );
}