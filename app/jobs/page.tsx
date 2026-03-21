"use client";

import { Badge, Card, Avatar, Dropdown } from "flowbite-react";
import Link from "next/link";
import { 
  HiSearch, 
  HiOutlineLocationMarker, 
  HiOutlineBriefcase, 
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineBell
} from "react-icons/hi";

const demoJobs = [
  { id: "1", title: "Frontend Intern (Next.js)", company: "Acme Labs", location: "Remote", type: "Internship" },
  { id: "2", title: "Data Science Intern", company: "Zen Analytics", location: "Colombo", type: "Internship" },
  { id: "3", title: "Cloud Support Intern", company: "Nimbus Cloud", location: "Hybrid", type: "Internship" },
];

export default function JobsPage() {
  
  const user = {
    name: "Chamindu Perera",
    email: "chamindu@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    status: "Student"
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      
      {/* --- Header & Navigation with Profile --- */}
      <nav className="border-b bg-white px-6 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-700">InternshipPortal</Link>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-blue-600">
              <HiOutlineBell className="text-2xl" />
            </button>
            
            {/* User Profile Dropdown */}
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="User settings" img={user.avatar} rounded size="sm" className="ring-2 ring-blue-100 p-0.5" />}
            >
              <Dropdown.Header>
                <span className="block text-sm font-bold">{user.name}</span>
                <span className="block truncate text-xs text-gray-500">{user.email}</span>
              </Dropdown.Header>
              <Dropdown.Item icon={HiOutlineUserCircle}>My Profile</Dropdown.Item>
              <Dropdown.Item icon={HiOutlineBriefcase}>My Applications</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={HiOutlineLogout} className="text-red-600">Sign out</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* --- Search Section (Hero) --- */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-12 text-center">
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-2 text-3xl font-extrabold text-white">Hello, {user.name.split(' ')[0]}! 👋</h1>
            <p className="mb-8 text-blue-100">Explore the best internship opportunities curated for you.</p>
            
            {/* Search Bar Container */}
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl md:flex-row md:rounded-full">
                <div className="flex w-full items-center px-4 md:w-2/5">
                <HiSearch className="text-xl text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search jobs..." 
                    className="w-full border-none focus:ring-0 text-gray-700"
                />
                </div>
                <div className="hidden h-8 w-px bg-gray-200 md:block"></div>
                <div className="flex w-full items-center px-4 md:w-1/4">
                <HiOutlineBriefcase className="mr-2 text-xl text-gray-400" />
                <select className="w-full border-none bg-transparent focus:ring-0 text-gray-600">
                    <option>Category</option>
                </select>
                </div>
                <button className="w-full rounded-xl bg-lime-500 px-8 py-3 font-bold text-white transition-all hover:bg-lime-600 md:w-auto md:rounded-full">
                SEARCH
                </button>
            </div>
        </div>
      </div>

      {/* --- Main Content: Grid with Profile Sidebar & Jobs --- */}
      <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-6 md:grid-cols-12">
        
        {/* Left Side: Profile Summary Card */}
        <div className="md:col-span-3">
          <Card className="rounded-3xl border-none shadow-sm">
            <div className="flex flex-col items-center pb-4 text-center">
              <Avatar img={user.avatar} rounded size="xl" className="mb-4 ring-4 ring-blue-50" />
              <h5 className="mb-1 text-xl font-bold text-gray-900">{user.name}</h5>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase">
                {user.status}
              </span>
              
              <div className="mt-6 w-full space-y-3 text-left">
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-gray-500">Applied Jobs</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-gray-500">Saved</span>
                  <span className="font-bold text-blue-600">05</span>
                </div>
              </div>
              
              <Link href="/profile/edit" className="mt-6 w-full rounded-xl border border-blue-600 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white text-center">
                Edit Profile
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Side: Jobs List */}
        <div className="md:col-span-9">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Latest Opportunities</h2>
            <span className="text-sm text-gray-500">{demoJobs.length} jobs found</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {demoJobs.map((job) => (
              <Card key={job.id} className="group border-none shadow-sm transition-all hover:shadow-lg rounded-3xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">{job.title}</h3>
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      {job.company} • <HiOutlineLocationMarker className="text-blue-500" /> {job.location}
                    </p>
                  </div>
                  <Badge color="success">{job.type}</Badge>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <Link href={`/jobs/${job.id}`} className="text-sm font-bold text-blue-600">
                    View Details
                  </Link>
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
                    Apply Now
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}