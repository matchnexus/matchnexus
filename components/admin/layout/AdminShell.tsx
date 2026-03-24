import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background-base text-gray-700">
      <AdminSidebar />

      <div className="lg:pl-72">
        <AdminNavbar />
        <main className="p-4 sm:p-6 lg:p-8 bg-background-soft">
          {children}
        </main>
      </div>
    </div>
  );
}