"use client";

import {
  Card,
  Label,
  Button,
  Avatar,
  Badge,
  Select,
  Dropdown,
} from "flowbite-react";
import { useState, ChangeEvent, useRef, KeyboardEvent, useEffect } from "react";
import {
  HiLocationMarker,
  HiDownload,
  HiSave,
  HiOfficeBuilding,
  HiLibrary,
  HiAcademicCap,
  HiCalendar,
  HiX,
  HiLightningBolt,
  HiFingerPrint,
} from "react-icons/hi";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function UserFriendlyProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    address: "",
    dob: "",
    institute: "",
    department: "",
    degreeType: "",
    grade: "",
    github: "",
    linkedin: "",
    cvFile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);
  const [existingResumePath, setExistingResumePath] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        const student = data.user.student;

        setForm({
          studentId: student?.studentId || "",
          firstName: student?.firstName || "",
          lastName: student?.lastName || "",
          address: student?.address || "",
          dob: student?.dob
            ? new Date(student.dob).toISOString().split("T")[0]
            : "",
          institute: student?.institute || "",
          department: student?.department || "",
          degreeType: student?.degreeType || "",
          grade: student?.grade?.toString() || "",
          github: student?.githubLink || "",
          linkedin: student?.linkedinLink || "",
          cvFile: null,
        });

        if (student?.skills) {
          setSelectedSkills(student.skills.map((s: any) => s.skill.name));
        }

        const latestResume = student?.resumes?.[0];
        if (latestResume) {
          setExistingResumePath(latestResume.filePath);
        }

        const skillRes = await fetch("/api/skills");
        const skillData = await skillRes.json();
        setAllSkills(skillData.map((s: any) => s.name));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (skillsRef.current && !skillsRef.current.contains(e.target as Node)) {
        setSkillsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    if (!form.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";

    if (form.dob) {
      const selectedDate = new Date(form.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.dob = "Birthday cannot be in the future";
      }
    }

    const gpa = parseFloat(form.grade);
    if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
      newErrors.grade = "GPA must be 0.00 - 4.00";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();

      formData.append("studentId", form.studentId);
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("address", form.address);
      formData.append("institute", form.institute);
      formData.append("department", form.department);
      formData.append("degreeType", form.degreeType);

      if (form.dob) formData.append("dob", form.dob);
      if (form.grade) formData.append("grade", form.grade);
      if (form.github) formData.append("github", form.github);
      if (form.linkedin) formData.append("linkedin", form.linkedin);

      formData.append("skills", JSON.stringify(selectedSkills));

      if (form.cvFile) {
        formData.append("cvFile", form.cvFile);
      }

      const res = await fetch("/api/profile/update", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Update failed");
        return;
      }

      toast.success("Updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, cvFile: e.target.files[0] });
    }
  };

  const handleDownload = () => {
    let fileUrl = form.cvFile
      ? URL.createObjectURL(form.cvFile)
      : "/my_cv_v2.pdf";
    let fileName = form.cvFile ? form.cvFile.name : "my_cv_v2.pdf";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="min-h-screen bg-white pb-10 font-sans -mx-4 -mt-6">
      {/* --- Hero Header --- */}
      <section className="relative bg-sky-700 py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-extrabold text-white md:text-5xl tracking-tight">
              My Profile
            </h1>
            <p className="mt-2 text-white/80 font-medium text-lg">
              Manage your personal and academic information
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleUpdate}
            className="flex items-center gap-2 rounded-xl bg-sky-800 px-8 py-3 text-sm font-extrabold text-white transition-all hover:bg-sky-900 shadow-lg uppercase tracking-wider"
          >
            <HiSave className="h-5 w-5" />
            Update Changes
          </motion.button>
        </div>
      </section>

      {/* --- Main Content --- */}
      <div className="mx-auto mt-16 max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Side Card */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                {/* Card top accent bar — matches Jobs page sky-700 hero */}
                <div className="bg-sky-700 h-20 -m-6 mb-0" />

                <div className="flex flex-col items-center -mt-10 relative z-10 px-6 pb-6">
                  <Avatar
                    img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    rounded
                    size="xl"
                    className="ring-4 ring-white rounded-full shadow-lg mb-4"
                  />

                  {/* Full Name */}
                  <div className="space-y-1 w-full text-center">
                    <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                      Full Name
                    </Label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className={`text-xl font-extrabold text-gray-900 text-center border-none focus:ring-2 ${
                        errors.firstName
                          ? "ring-2 ring-red-500 bg-red-50"
                          : "focus:ring-sky-200 bg-sky-50/50"
                      } w-full rounded-xl py-1 transition-all`}
                    />
                    {errors.firstName && (
                      <p className="text-[10px] text-red-500 font-bold uppercase">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Student ID Badge */}
                  <div className="mt-4 w-full flex flex-col items-center">
                    <Badge className="rounded-full px-4 py-1.5 font-bold text-[10px] bg-sky-800 text-white border border-sky-200 uppercase flex items-center gap-1.5">
                      <input
                        name="studentId"
                        value={form.studentId}
                        onChange={handleChange}
                        className={`bg-transparent border-none focus:ring-0 p-0 text-[11px] font-extrabold uppercase tracking-widest text-white w-24 text-center ${
                          errors.studentId ? "placeholder:text-red-400" : ""
                        }`}
                        placeholder="IT NUMBER"
                      />
                    </Badge>
                    {errors.studentId && (
                      <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
                        {errors.studentId}
                      </p>
                    )}
                  </div>
                </div>

                {/* GPA & Links */}
                <div className="w-full space-y-4 pt-6 border-t border-gray-100 px-6 pb-6">
                  {/* GPA */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">
                      GPA Score
                    </Label>
                    <div className="relative">
                      <HiAcademicCap
                        className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${
                          errors.grade ? "text-red-400" : "text-sky-400"
                        }`}
                      />
                      <input
                        name="grade"
                        type="number"
                        step="0.01"
                        value={form.grade}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border-none rounded-xl text-sm font-bold text-gray-700 focus:ring-2 transition-all ${
                          errors.grade
                            ? "bg-red-50 ring-2 ring-red-500"
                            : "bg-sky-50/50 focus:ring-sky-200"
                        }`}
                      />
                    </div>
                    {errors.grade && (
                      <p className="text-[10px] text-red-500 font-bold uppercase ml-1">
                        {errors.grade}
                      </p>
                    )}
                  </div>

                  {/* GitHub */}
                  <div className="relative group">
                    <AiFillGithub
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900"
                    />
                    <input
                      name="github"
                      value={form.github}
                      onChange={handleChange}
                      placeholder="GitHub URL"
                      className="w-full pl-10 pr-4 py-3 bg-sky-50/50 border-none rounded-xl text-xs font-mono text-gray-500 focus:ring-2 focus:ring-sky-200 transition-all"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="relative group">
                    <AiFillLinkedin
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-600"
                    />
                    <input
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                      className="w-full pl-10 pr-4 py-3 bg-sky-50/50 border-none rounded-xl text-xs font-mono text-gray-500 focus:ring-2 focus:ring-sky-200 transition-all"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Side Details */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white p-6">

                {/* Section heading — matches Jobs page "Latest Opportunities" style */}
                <div className="mb-8 pb-6 border-b border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Academic &{" "}
                    <span className="text-sky-600">Professional Details</span>
                  </h2>
                  <p className="text-gray-500 mt-1 font-medium">
                    Keep your information up to date
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">

                  {/* Institute */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Institute
                    </Label>
                    <div className="relative">
                      <HiLibrary className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 z-10" />
                      <input
                        name="institute"
                        value={form.institute}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-sky-50/50 border-none rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-sky-200 transition-all"
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Birthday
                    </Label>
                    <div className="relative">
                      <HiCalendar
                        className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors ${
                          errors.dob ? "text-red-400" : "text-sky-400"
                        }`}
                      />
                      <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border-none rounded-xl text-sm font-bold text-gray-700 focus:ring-2 transition-all ${
                          errors.dob
                            ? "bg-red-50 ring-2 ring-red-500"
                            : "bg-sky-50/50 focus:ring-sky-200"
                        }`}
                      />
                    </div>
                    {errors.dob && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 uppercase ml-1">
                        {errors.dob}
                      </p>
                    )}
                  </div>

                  {/* Department Select */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Department
                    </Label>
                    <Select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      icon={HiOfficeBuilding}
                      required
                      theme={{
                        field: {
                          select: {
                            base: "block w-full border-none",
                            colors: {
                              gray: "bg-sky-50/50 text-gray-700 font-bold text-sm rounded-xl focus:ring-2 focus:ring-sky-200",
                            },
                            withIcon: { on: "pl-11" },
                          },
                          icon: {
                            base: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none",
                            svg: "h-5 w-5 text-sky-400",
                          },
                        },
                      }}
                    >
                      <option value="Computing">Computing</option>
                      <option value="Business Management">Business Management</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Accounting">Accounting</option>
                    </Select>
                  </div>

                  {/* Degree Type Select */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Degree Type
                    </Label>
                    <Select
                      name="degreeType"
                      value={form.degreeType}
                      onChange={handleChange}
                      icon={HiAcademicCap}
                      required
                      theme={{
                        field: {
                          select: {
                            base: "block w-full border-none",
                            colors: {
                              gray: "bg-sky-50/50 text-gray-700 font-bold text-sm rounded-xl focus:ring-2 focus:ring-sky-200",
                            },
                            withIcon: { on: "pl-11" },
                          },
                          icon: {
                            base: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none",
                            svg: "h-5 w-5 text-sky-400",
                          },
                        },
                      }}
                    >
                      <option value="UNDERGRADUATE">Undergraduate</option>
                      <option value="GRADUATE">Graduate</option>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1 mb-6">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Residential Address
                  </Label>
                  <div className="relative">
                    <HiLocationMarker
                      className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                        errors.address ? "text-red-400" : "text-sky-400"
                      }`}
                    />
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-none rounded-xl text-sm font-bold text-gray-700 focus:ring-2 transition-all ${
                        errors.address
                          ? "bg-red-50 ring-2 ring-red-500"
                          : "bg-sky-50/50 focus:ring-sky-200"
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-[10px] text-red-500 font-bold uppercase ml-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-3" ref={skillsRef}>
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Professional Skills
                  </Label>

                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-1">
                      {selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedSkills(
                                selectedSkills.filter((s) => s !== skill),
                              )
                            }
                            className="text-sky-500 hover:text-red-500 ml-0.5 transition-colors"
                          >
                            <HiX size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSkillsOpen((prev) => !prev)}
                      className={`w-full flex items-center justify-between px-4 py-3 bg-sky-50/50 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-sky-200 ${
                        skillsOpen ? "ring-2 ring-sky-200" : ""
                      }`}
                    >
                      <span
                        className={
                          selectedSkills.length === 0
                            ? "text-gray-400 font-semibold"
                            : "text-gray-700"
                        }
                      >
                        {selectedSkills.length === 0
                          ? "Select Skills"
                          : `${selectedSkills.length} skill${selectedSkills.length > 1 ? "s" : ""} selected`}
                      </span>
                      <svg
                        className={`w-4 h-4 text-sky-400 transition-transform duration-200 ${skillsOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {skillsOpen && (
                      <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                        <div className="max-h-48 overflow-y-auto py-1">
                          {allSkills.map((skill) => {
                            const isSelected = selectedSkills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => {
                                  setSelectedSkills(
                                    isSelected
                                      ? selectedSkills.filter((s) => s !== skill)
                                      : [...selectedSkills, skill],
                                  );
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors text-left ${
                                  isSelected
                                    ? "bg-sky-50 text-sky-700"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                <span>{skill}</span>
                                {isSelected && (
                                  <svg
                                    className="w-4 h-4 text-sky-500 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CV / Resume Section */}
                <div className="mt-10 p-6 bg-sky-50/60 rounded-2xl border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Icon box — mirrors the Jobs card icon style */}
                    <div className="p-3 bg-sky-100 rounded-xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                      <HiDownload size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-sky-500 tracking-widest">
                        Resume / CV
                      </p>
                      <p className="text-sm font-bold text-gray-700 truncate max-w-[150px]">
                        {form.cvFile
                          ? form.cvFile.name
                          : existingResumePath
                            ? existingResumePath.split("/").pop()
                            : "No CV uploaded"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf"
                    />
                    {/* Replace button — grey/dark like Jobs "Apply Now" default */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 md:flex-none rounded-lg bg-gray-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition-all shadow-sm uppercase tracking-wider"
                    >
                      Replace
                    </button>
                    {/* Download button — lime like Jobs search button */}
                    <button
                      onClick={handleDownload}
                      className="flex-1 md:flex-none rounded-lg bg-sky-600 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-sky-700 transition-all shadow-lg uppercase tracking-wider"
                    >
                      Download
                    </button>
                  </div>
                </div>

              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}