"use client";

import { Card } from "flowbite-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaShieldAlt, FaBrain, FaCogs, FaChartLine, FaUserCheck, FaRocket } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function HomePage() {
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Add your images here: replace with actual image paths
  const slides = [
    "/photos/05.jpg",
    "/photos/06.jpg",
    "/photos/02.jpg",
    "/photos/04.jpg",
    "/photos/03.jpg",
    "/photos/01.jpg",
    // Add more image paths here as needed
  ];

  // Auto-play carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="-mx-4 -mt-6">
      {/* HERO */}
      <section className="relative min-h-[520px] w-full overflow-hidden">
        {/* Background image (place file at: /public/photos/hero.jpg) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/photos/hero.jpg')" }}
        />

        {/* Blue overlay like the screenshot */}
        {<div className="absolute inset-0 bg-sky-700/70" />}

        {/* Hero content */}
        <div className="relative mx-auto flex max-w-11xl flex-col items-center px-6 pt-40 text-center text-white">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
            Give your Career a Jumpstart
          </h1>

          <p className="mt-6 max-w-3xl text-sm leading-6 text-white/90 md:text-base">
            MatchNexus is a smart ML-powered internship platform connecting students and verified companies.
            Discover opportunities, build skills, and apply faster with intelligent matching.
          </p>

          {/* Search bar mock (like screenshot) */}
          <div className="mt-10 w-full max-w-5xl rounded-2xl bg-white p-3 shadow-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-sky-400"
                placeholder="I'm looking for... (Eg: Job title, Position, Company)"
              />

              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none md:w-56">
                <option>Job Category</option>
                <option>Software Engineering</option>
                <option>Data Science</option>
                <option>UI/UX</option>
              </select>

              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none md:w-44">
                <option>Location</option>
                <option>Colombo</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>

              <Link
                href="/jobs"
                className="rounded-xl bg-lime-500 px-8 py-3 text-center text-sm font-extrabold text-white hover:bg-lime-400 md:w-48"
              >
                SEARCH
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Why Choose <span className="bg-gradient-to-r from-sky-600 to-lime-500 bg-clip-text text-transparent">MatchNexus?</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-lg">
            Experience the future of internship matching with AI-powered intelligence and verified opportunities
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1: Verified Companies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300">
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <motion.div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaShieldAlt className="text-2xl text-white" />
                </motion.div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">Verified Companies</h3>
                <p className="mb-4 leading-6 text-gray-600">
                  Domain-locked registration ensures only legitimate companies post opportunities. Reduce fake jobs and build trust with every application.
                </p>
                
                <div className="mb-6 space-y-2">
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    100% company verification
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Safe and secure
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Zero fake postings
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-lg bg-sky-500 py-2 text-white font-semibold transition-all hover:bg-sky-600"
                >
                  Learn More →
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: AI Skill Matching */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <motion.div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaBrain className="text-2xl text-white" />
                </motion.div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">AI-Powered Matching</h3>
                <p className="mb-4 leading-6 text-gray-600">
                  Our advanced ML algorithm learns your skills and matches you with ideal internships. Get personalized recommendations that matter.
                </p>

                <div className="mb-6 space-y-2">
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Smart skill matching
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Personalized feed
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Better opportunities
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-lg bg-purple-500 py-2 text-white font-semibold transition-all hover:bg-purple-600"
                >
                  Learn More →
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Smart Admin Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <motion.div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaCogs className="text-2xl text-white" />
                </motion.div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">Powerful Admin Controls</h3>
                <p className="mb-4 leading-6 text-gray-600">
                  Full platform management with company verification, job moderation, and detailed analytics. Stay in complete control.
                </p>

                <div className="mb-6 space-y-2">
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Complete oversight
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Real-time analytics
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Easy moderation
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-lg bg-orange-500 py-2 text-white font-semibold transition-all hover:bg-orange-600"
                >
                  Learn More →
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Feature 4: Fast Applications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <motion.div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaRocket className="text-2xl text-white" />
                </motion.div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">Apply in Seconds</h3>
                <p className="mb-4 leading-6 text-gray-600">
                  One-click applications with pre-filled information. Save time and apply to more opportunities faster than ever.
                </p>

                <div className="mb-6 space-y-2">
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    One-click apply
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Auto-filled profiles
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Higher success rate
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-lg bg-green-500 py-2 text-white font-semibold transition-all hover:bg-green-600"
                >
                  Learn More →
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Feature 5: Real-time Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <motion.div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaChartLine className="text-2xl text-white" />
                </motion.div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">Performance Insights</h3>
                <p className="mb-4 leading-6 text-gray-600">
                  Track your applications, success rates, and career growth with detailed analytics and insights in real-time.
                </p>

                <div className="mb-6 space-y-2">
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Detailed analytics
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Success tracking
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Career insights
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-lg bg-indigo-500 py-2 text-white font-semibold transition-all hover:bg-indigo-600"
                >
                  Learn More →
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Feature 6: Secure Payments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <motion.div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaUserCheck className="text-2xl text-white" />
                </motion.div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">User-Friendly Platform</h3>
                <p className="mb-4 leading-6 text-gray-600">
                  Intuitive interface designed for students and companies. No steep learning curve—start immediately and explore opportunities.
                </p>

                <div className="mb-6 space-y-2">
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Easy to use
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Intuitive design
                  </p>
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-500" />
                    Quick setup
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-lg bg-pink-500 py-2 text-white font-semibold transition-all hover:bg-pink-600"
                >
                  Learn More →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* IMAGE CAROUSEL/SLIDER SECTION */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            {/* <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Platform Showcase
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 text-sm md:text-base">
              See how MatchNexus works in action
            </p> */}
          </motion.div>

          {/* Carousel Container - Compact Size */}
          <div className="relative w-full overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: "9/4" }}>
            {/* Slides */}
            <div className="relative w-full h-full">
              {slides.map((slide, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${slide}')` }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Left Arrow */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/70 p-2 text-gray-900 transition-all backdrop-blur-sm hover:bg-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/70 p-2 text-gray-900 transition-all backdrop-blur-sm hover:bg-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? "w-6 bg-white" 
                      : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </div>

          {/* Slide Info */}
          <div className="mt-3 text-center">
            <p className="text-gray-500 text-xs">
              Slide {currentSlide + 1} of {slides.length}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-lime-500 p-12 text-center text-white shadow-2xl"
        >
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Your Journey?</h3>
          <p className="mb-8 text-lg text-white/90">
            Join thousands of students already finding their perfect internship on MatchNexus
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/login"
                className="inline-block rounded-xl bg-white px-8 py-3 font-bold text-sky-600 transition-all hover:bg-gray-100"
              >
                Get Started as Student
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/company/login"
                className="inline-block rounded-xl border-2 border-white px-8 py-3 font-bold text-white transition-all hover:bg-white/10"
              >
                Register Your Company
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>





      
    </div>
  );
}