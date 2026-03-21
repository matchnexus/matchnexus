"use client";

import { Card, Label, TextInput, Button, Select } from "flowbite-react";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Types
type FormData = {
  fullName: string;
  dob: string;
  gender: string;
  address: string;
  email: string;
  studentId: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<FormData>({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    email: "",
    studentId: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const today = new Date().toISOString().split("T")[0];

    // 1. Full Name Validation
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    
    const sliitEmailRegex = /^(it|IT)[0-9]{8}@my\.sliit\.lk$/;
    
    if (!form.email) {
      newErrors.email = "Email address is required";
    } else if (!sliitEmailRegex.test(form.email)) {
      newErrors.email = "Invalid format. Use 'itXXXXXXXX@my.sliit.lk'";
    }

    // 3. Student ID Validation
    if (!form.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }

    // 4. Date of Birth Validation
    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (form.dob > today) {
      newErrors.dob = "Date of birth cannot be in the future";
    }

    // 5. Gender Validation
    if (!form.gender) {
      newErrors.gender = "Please select your gender";
    }

    // 6. Address Validation
    if (!form.address.trim()) {
      newErrors.address = "Residential address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Success! Data:", form);
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-500 to-blue-700 px-4 py-10 font-sans">
      <Card className="w-full max-w-2xl border-none rounded-3xl bg-white/95 backdrop-blur-lg shadow-2xl p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">Student Registration</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">Please enter your SLIIT student details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div className="md:col-span-2">
              <Label htmlFor="fullName" value="Full Name" className="mb-2 block font-semibold text-slate-700" />
              <TextInput 
                id="fullName"
                name="fullName" 
                placeholder="Enter your full name" 
                value={form.fullName} 
                onChange={handleChange} 
                color={errors.fullName ? "failure" : "gray"}
                helperText={errors.fullName}
                sizing="lg" 
              />
            </div>
            
            {/* Email Field with updated validation */}
            <div>
              <Label htmlFor="email" value="SLIIT Student Email" className="mb-2 block font-semibold text-slate-700" />
              <TextInput 
                id="email"
                name="email" 
                type="email" 
                placeholder="it21xxxxxx@my.sliit.lk" 
                value={form.email} 
                onChange={handleChange} 
                color={errors.email ? "failure" : "gray"} 
                helperText={errors.email} 
                sizing="lg" 
              />
            </div>

            <div>
              <Label htmlFor="studentId" value="Student ID" className="mb-2 block font-semibold text-slate-700" />
              <TextInput 
                id="studentId"
                name="studentId" 
                placeholder="IT21xxxxxx" 
                value={form.studentId} 
                onChange={handleChange} 
                color={errors.studentId ? "failure" : "gray"} 
                helperText={errors.studentId} 
                sizing="lg" 
              />
            </div>

            <div>
              <Label htmlFor="dob" value="Date of Birth" className="mb-2 block font-semibold text-slate-700" />
              <TextInput 
                id="dob"
                name="dob" 
                type="date" 
                value={form.dob} 
                onChange={handleChange} 
                color={errors.dob ? "failure" : "gray"} 
                helperText={errors.dob} 
                sizing="lg" 
              />
            </div>

            <div>
              <Label htmlFor="gender" value="Gender" className="mb-2 block font-semibold text-slate-700" />
              <Select 
                id="gender"
                name="gender" 
                value={form.gender} 
                onChange={handleChange} 
                color={errors.gender ? "failure" : "gray"} 
                sizing="lg"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
              {errors.gender && <p className="text-red-500 text-xs mt-1 font-bold">{errors.gender}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address" value="Address" className="mb-2 block font-semibold text-slate-700" />
              <TextInput 
                id="address"
                name="address" 
                placeholder="Enter your residential address" 
                value={form.address} 
                onChange={handleChange} 
                color={errors.address ? "failure" : "gray"} 
                helperText={errors.address} 
                sizing="lg" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button 
              type="submit" 
              className="rounded-xl bg-lime-500 enabled:hover:bg-lime-600 text-white shadow-xl transition-all transform active:scale-95 border-none"
            >
              <span className="text-xl font-bold py-1 uppercase tracking-wider">Register Now</span>
            </Button>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <button 
                type="button" 
                onClick={() => router.push("/auth/login")} 
                className="text-sm font-bold text-gray-600 hover:text-sky-600 transition-colors underline underline-offset-4"
              >
                Already have an account? Login
              </button>
              
              <Link href="/" className="text-[10px] font-black text-gray-400 hover:text-slate-600 uppercase tracking-[0.2em]">
                — Back to Home —
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}