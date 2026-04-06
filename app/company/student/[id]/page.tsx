"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Spinner } from "flowbite-react";
import { HiArrowLeft } from "react-icons/hi";

type StudentProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  institute: string;
  department: string;
  degreeType: string;
  grade: string | null;
  githubLink: string | null;
  linkedinLink: string | null;
  personalPortfolio: string | null;
  skills: Array<{
    skill: {
      name: string;
    };
    level: string | null;
  }>;
  resumes: Array<{
    id: string;
    filePath: string;
    uploadedAt: string;
  }>;
};

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/student/${studentId}`);

        if (!response.ok) {
          throw new Error("Failed to load student profile");
        }

        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-100/50">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
          >
            <HiArrowLeft /> Back
          </button>
          <Card className="border-0 bg-white shadow-md">
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">{error || "Student not found"}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
        >
          <HiArrowLeft /> Back to Applications
        </button>

        {/* Student Header */}
        <Card className="border-0 bg-white shadow-md">
          <div className="pb-6 border-b border-slate-200">
            <h1 className="text-4xl font-black text-slate-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="mt-2 text-slate-600">{student.email}</p>
          </div>

          {/* Education Info */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Institute</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{student.institute}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Department</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{student.department}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Degree Type</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{student.degreeType}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">GPA</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{student.grade || "N/A"}</p>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Links</p>
            <div className="flex flex-wrap gap-3">
              {student.githubLink && (
                <a
                  href={student.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  GitHub
                </a>
              )}
              {student.linkedinLink && (
                <a
                  href={student.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  LinkedIn
                </a>
              )}
              {student.personalPortfolio && (
                <a
                  href={student.personalPortfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* Skills Section */}
        {student.skills.length > 0 && (
          <Card className="mt-6 border-0 bg-white shadow-md">
            <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {student.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
                >
                  {skill.skill.name}
                  {skill.level && <span className="ml-2 text-xs opacity-75">({skill.level})</span>}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* CV Section */}
        {student.resumes.length > 0 && (
          <Card className="mt-6 border-0 bg-white shadow-md">
            <h2 className="text-2xl font-bold text-slate-900">Resume</h2>
            <div className="mt-4 space-y-3">
              {student.resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {resume.filePath.split("/").pop() || "Resume"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={resume.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View CV
                  </a>
                </div>
              ))}
            </div>
          </Card>
        )}

        {student.resumes.length === 0 && (
          <Card className="mt-6 border-0 bg-white shadow-md">
            <p className="text-center text-slate-500">No resume uploaded yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
