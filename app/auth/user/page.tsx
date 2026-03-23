"use client";

import { Card, Label, Button, Avatar, Badge, Select } from "flowbite-react";
import { useState, ChangeEvent, useRef, KeyboardEvent } from "react";
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

export default function UserFriendlyProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    studentId: "IT21004567",
    firstName: "Chamindu",
    lastName: "Perera",
    address: "123, Main Street, Colombo",
    dob: "2000-05-15",
    institute: "SLIIT",
    department: "Computing",
    degreeType: "Undergraduate",
    grade: "3.85",
    github: "https://github.com/chamindu",
    linkedin: "https://linkedin.com/in/chamindu",
    cvFile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skills, setSkills] = useState<string[]>(["React", "Node.js", "SQL"]);
  const [skillInput, setSkillInput] = useState("");

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

    // --- Future Date Validation Start ---
    if (form.dob) {
      const selectedDate = new Date(form.dob);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        newErrors.dob = "Birthday cannot be in the future";
      }
    }
    // --- Future Date Validation End ---

    const gpa = parseFloat(form.grade);
    if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
      newErrors.grade = "GPA must be 0.00 - 4.00";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      const formattedGPA = parseFloat(form.grade).toFixed(2);
      setForm({ ...form, grade: formattedGPA });
      toast.success("Update Successfully!");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, cvFile: e.target.files[0] });
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
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
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] py-10 px-4 md:px-8 font-sans">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            My Profile
          </h1>
          <Button
            onClick={handleUpdate}
            className="rounded-xl bg-[#87D01A] enabled:hover:bg-[#76B817] shadow-lg border-none px-8"
          >
            <HiSave className="mr-2 h-5 w-5" />
            <span className="font-bold uppercase">Update Changes</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side Card */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-24 -m-6 mb-0"></div>
              <div className="flex flex-col items-center -mt-12 relative z-10 px-6 pb-6">
                <Avatar
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded
                  size="xl"
                  className="ring-4 ring-white rounded-full shadow-lg mb-4"
                />
                <div className="space-y-1 w-full text-center">
                  <Label className="text-[10px] font-black uppercase text-slate-400">
                    Full Name
                  </Label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`text-xl font-black text-slate-800 text-center border-none focus:ring-2 ${errors.firstName ? "ring-2 ring-red-500 bg-red-50" : "focus:ring-blue-100 bg-slate-50"} w-full rounded-xl py-1 transition-all`}
                  />
                </div>
                <div className="mt-4 w-full flex flex-col items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border ${errors.studentId ? "border-red-500" : "border-blue-100"}`}
                  >
                    <HiFingerPrint className="text-blue-500" />
                    <input
                      name="studentId"
                      value={form.studentId}
                      onChange={handleChange}
                      className="bg-transparent border-none focus:ring-0 p-0 text-[11px] font-black uppercase tracking-widest text-blue-600 w-24 text-center"
                      placeholder="IT NUMBER"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full mt-4 space-y-4 pt-6 border-t border-slate-100 px-6 pb-6">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    GPA Score
                  </Label>
                  <div className="relative">
                    <HiAcademicCap
                      className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors text-lg ${errors.grade ? "text-red-400" : "text-slate-300"}`}
                    />
                    <input
                      name="grade"
                      type="number"
                      step="0.01"
                      value={form.grade}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 transition-all ${errors.grade ? "bg-red-50 ring-2 ring-red-500" : "bg-slate-50 focus:ring-blue-100"}`}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative group">
                    <AiFillGithub
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-800"
                    />
                    <input
                      name="github"
                      value={form.github}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-mono text-slate-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <AiFillLinkedin
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600"
                    />
                    <input
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-mono text-slate-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side Details */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-[2rem] border-none shadow-sm bg-white p-6">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#87D01A] rounded-full"></span>{" "}
                ACADEMIC & PROFESSIONAL DETAILS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Institute
                  </Label>
                  <div className="relative">
                    <HiLibrary className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 z-10" />
                    <input
                      name="institute"
                      value={form.institute}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Birthday with Validation */}
                <div className="space-y-1">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Birthday
                  </Label>
                  <div className="relative">
                    <HiCalendar
                      className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors ${errors.dob ? "text-red-400" : "text-slate-300"}`}
                    />
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 transition-all ${
                        errors.dob
                          ? "bg-red-50 ring-2 ring-red-500"
                          : "bg-slate-50 focus:ring-blue-100"
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
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
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
                            gray: "bg-slate-50 text-slate-700 font-bold text-sm rounded-xl focus:ring-2 focus:ring-blue-100",
                          },
                          withIcon: {
                            on: "pl-11",
                          },
                        },
                        icon: {
                          base: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none",
                          svg: "h-5 w-5 text-slate-300 transition-colors group-focus-within:text-blue-500", // Icon එකේ size එක සහ color එක මෙතනින් පාලනය වේ
                        },
                      },
                    }}
                  >
                    <option value="Computing">Computing</option>
                    <option value="Business Management">
                      Business Management
                    </option>
                    <option value="Marketing">Marketing</option>
                    <option value="Accounting">Accounting</option>
                  </Select>
                </div>

                {/* Degree Type Select */}
                <div className="space-y-1">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
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
                            gray: "bg-slate-50 text-slate-700 font-bold text-sm rounded-xl focus:ring-2 focus:ring-blue-100",
                          },
                          withIcon: {
                            on: "pl-11",
                          },
                        },
                        icon: {
                          base: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none",
                          svg: "h-5 w-5 text-slate-300",
                        },
                      },
                    }}
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1 mb-6">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Residential Address
                </Label>
                <div className="relative">
                  <HiLocationMarker
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.address ? "text-red-400" : "text-slate-300"}`}
                  />
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 transition-all ${errors.address ? "bg-red-50 ring-2 ring-red-500" : "bg-slate-50 focus:ring-blue-100"}`}
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* Skills and CV Section remains same */}
              <div className="space-y-3 group">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Professional Skills (Type & Press Enter)
                </Label>
                <div className="relative">
                  <HiLightningBolt className="absolute left-3 top-4 text-slate-300" />
                  <div className="w-full min-h-[50px] pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus-within:ring-2 focus-within:ring-blue-100 flex flex-wrap gap-2 items-center">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <HiX size={14} />
                        </button>
                      </span>
                    ))}
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 min-w-[120px] p-1"
                      placeholder={skills.length === 0 ? "Add skills..." : ""}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-blue-50/50 rounded-[1.5rem] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600">
                    <HiDownload size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
                      Resume / CV
                    </p>
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                      {form.cvFile ? form.cvFile.name : "my_cv_v2.pdf"}
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
                  <Button
                    size="sm"
                    color="light"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl font-bold flex-1 md:flex-none"
                  >
                    Replace
                  </Button>
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="rounded-xl font-bold bg-blue-600 flex-1 md:flex-none transition-all active:scale-95 shadow-md"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
