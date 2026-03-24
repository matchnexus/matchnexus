import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Admin credentials validation
 * In production, use environment variables or secure credential storage
 */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@matchnexus.com";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lm";

export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<{ valid: boolean; admin?: any }> {
  console.log("🔐 Admin Login Attempt:");
  console.log("- Input Email:", email);
  console.log("- Expected Email:", ADMIN_EMAIL);
  console.log("- Input Password:", password);
  console.log("- Password Hash (first 20 chars):", ADMIN_PASSWORD_HASH?.substring(0, 20));

  // Check if email matches admin email
  if (email !== ADMIN_EMAIL) {
    console.log("❌ Email mismatch");
    return { valid: false };
  }

  // Verify password against stored hash
  let isPasswordValid = false;
  try {
    isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    console.log("✅ Password comparison result:", isPasswordValid);
  } catch (err) {
    console.error("❌ Password comparison error:", err);
    return { valid: false };
  }

  if (!isPasswordValid) {
    console.log("❌ Password mismatch");
    return { valid: false };
  }
  console.log("✅ Credentials valid!");

  // Return admin profile if found in DB, or create a minimal admin object
  const adminUser = await prisma.user.findUnique({
    where: { email },
    include: { adminProfile: true },
  });

  return {
    valid: true,
    admin: adminUser || {
      id: "admin-system-user",
      email,
      role: "ADMIN",
      username: "Administrator",
    },
  };
}
