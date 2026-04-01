import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Admin credentials validation
 * In production, use environment variables or secure credential storage
 */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@matchnexus.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Development mode plaintext
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<{ valid: boolean; admin?: any }> {
  console.log("🔐 Admin Login Attempt:");
  console.log("- Input Email:", email);
  console.log("- Expected Email:", ADMIN_EMAIL);

  // Check if email matches admin email
  if (email !== ADMIN_EMAIL) {
    console.log("❌ Email mismatch");
    return { valid: false };
  }

  // Verify password - use plaintext in development, bcrypt in production
  let isPasswordValid = false;
  try {
    if (process.env.NODE_ENV === "production" && ADMIN_PASSWORD_HASH) {
      // Production: use bcrypt
      isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      console.log("✅ Password comparison result (bcrypt):", isPasswordValid);
    } else {
      // Development: simple string comparison
      isPasswordValid = password === ADMIN_PASSWORD;
      console.log("✅ Password comparison result (plaintext):", isPasswordValid);
    }
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
