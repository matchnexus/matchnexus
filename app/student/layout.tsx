import StudentHubNavbar from "@/components/StudentHubNavbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#F8FBFF" }} className="min-h-screen">
      <StudentHubNavbar />
      <main>{children}</main>
    </div>
  );
}
