"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Calendar, Briefcase, Trash2, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/student/applications", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to fetch");
        return;
      }
      setApplications(data);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this application?")) return;

    try {
      const res = await fetch(`/api/student/applications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Cancel failed");
        return;
      }
      toast.success("Application cancelled");
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "accepted":
        return "bg-lime-100 text-lime-700 border-lime-200"; // Matching Home lime
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const heroImages = [
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1600&q=80", // modern office building
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=80", // professional woman working
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80", // team collaboration
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80", // open office workspace
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        <p className="text-gray-500 animate-pulse font-medium">
          Loading your applications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10 -mx-4 -mt-6">
      {/* Hero-like Header Section */}
      <section className="relative bg-sky-700 py-16 px-6 text-center text-white mb-10 overflow-hidden">
        {/* Carousel background */}
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: currentSlide === i ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-sky-900/60" />

        {/* Existing content — unchanged */}
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight md:text-5xl"
          >
            My Applications
          </motion.h1>
          <p className="mt-4 text-sky-100 max-w-2xl mx-auto font-medium">
            Manage and track the progress of your internship applications in
            real-time.
          </p>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === i ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
          >
            <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">
              No applications found
            </h3>
            <p className="text-gray-500 mt-2">
              Start exploring opportunities and jumpstart your career.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-sky-50 rounded-2xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-gray-900 group-hover:text-sky-600 transition-colors">
                      {app.post?.title || "Untitled Position"}
                    </h2>

                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mt-1">
                      {app.post?.company?.companyName || "Verified Company"}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        <Calendar size={14} className="text-sky-500" />
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => handleCancel(app.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200"
                  >
                    <Trash2 size={16} />
                    CANCEL
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
