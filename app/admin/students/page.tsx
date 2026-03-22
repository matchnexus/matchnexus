import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { getAdminStudents } from "@/server/admin/students";
import { formatDate } from "@/lib/format";

type StudentRow = Awaited<ReturnType<typeof getAdminStudents>>[number];

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

      <SimpleTable<StudentRow>
        columns={[
          {
            key: "name",
            title: "Student",
            render: (row) => (
              <div>
                <p className="font-semibold text-gray-900">
                  {row.firstName} {row.lastName}
                </p>
                <p className="text-xs text-gray-500">{row.user.email}</p>
              </div>
            ),
          },
          {
            key: "institute",
            title: "Institute",
            render: (row) => (
              <div>
                <p>{row.institute}</p>
                <p className="text-xs text-gray-500">{row.department}</p>
              </div>
            ),
          },
          {
            key: "degree",
            title: "Degree",
            render: (row) => row.degreeType,
          },
          {
            key: "skills",
            title: "Skills",
            render: (row) => row.skills.length,
          },
          {
            key: "applications",
            title: "Applications",
            render: (row) => row.applications.length,
          },
          {
            key: "resumes",
            title: "Resumes",
            render: (row) => row.resumes.length,
          },
          {
            key: "status",
            title: "User Status",
            render: (row) => (
              <StatusBadge value={row.user.isActive ? "ACTIVE" : "INACTIVE"} />
            ),
          },
          {
            key: "joined",
            title: "Joined",
            render: (row) => formatDate(row.createdAt),
          },
        ]}
        rows={students}
      />
    </div>
  );
}