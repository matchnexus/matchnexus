"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StudentcoursesHub from "@/components/student/courses";
import StudentPaymentHub from "@/components/student/payment";
import {
  HiAcademicCap,
  HiCreditCard,
  HiSparkles,
  HiLightningBolt,
  HiTrendingUp,
  HiBookOpen,
  HiLockClosed,
  HiX,
} from "react-icons/hi";

const MANAGE_PIN = "admin2024";
