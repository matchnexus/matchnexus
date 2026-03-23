import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { getAdminStudents } from "@/server/admin/students";
import { AdminStudentsView } from "@/components/admin/student/AdminStudentsView";

export default async function AdminStudentsPage() {
  const students = await getAdminStudents();

  if (!students.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Students"
          description="Manage student profiles, skills, resumes, and activity."
        />
        <EmptyState
          title="No students found"
          description="Student records will appear here after registrations."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage student profiles, skills, resumes, and activity."
      />

      <AdminStudentsView students={students} />
    </div>
  );
}