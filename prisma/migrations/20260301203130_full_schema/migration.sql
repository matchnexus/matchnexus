/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('GRADUATE', 'UNDERGRADUATE');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BoostStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('COURSE', 'BOOST');

-- CreateEnum
CREATE TYPE "PaymentUserType" AS ENUM ('STUDENT', 'COMPANY');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYHERE', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "RecommendationContext" AS ENUM ('STUDENT_FEED', 'COMPANY_RANKING');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT,
    "dob" TIMESTAMP(3),
    "institute" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "degreeType" "DegreeType" NOT NULL,
    "grade" TEXT,
    "zScore" DECIMAL(5,4),
    "githubLink" TEXT,
    "linkedinLink" TEXT,
    "personalPortfolio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_skills" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "ProficiencyLevel",

    CONSTRAINT "student_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "corporateEmail" TEXT NOT NULL,
    "emailDomain" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_verifications" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "verificationToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_profiles" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "foundedYear" INTEGER,
    "headquartersLocation" TEXT,
    "description" TEXT,
    "missionStatement" TEXT,
    "workCulture" TEXT,
    "workType" "WorkType",
    "benefits" TEXT,
    "linkedinUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internship_posts" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT,
    "location" TEXT,
    "workType" "WorkType",
    "durationMonths" INTEGER,
    "stipendAmount" DECIMAL(10,2),
    "stipendCurrency" TEXT NOT NULL DEFAULT 'LKR',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "openingsCount" INTEGER NOT NULL DEFAULT 1,
    "applicationDeadline" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internship_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_required_skills" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "proficiencyLevel" "ProficiencyLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_required_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_optional_skills" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "proficiencyLevel" "ProficiencyLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_optional_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_skills" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "level" "ProficiencyLevel",

    CONSTRAINT "post_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "coverLetter" TEXT,
    "cvUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "isViewedByCompany" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "companyNote" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_ml_scores" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "overallScore" DECIMAL(5,2) NOT NULL,
    "requiredSkillsScore" DECIMAL(5,2) NOT NULL,
    "optionalSkillsScore" DECIMAL(5,2) NOT NULL,
    "experienceScore" DECIMAL(5,2) NOT NULL,
    "educationScore" DECIMAL(5,2) NOT NULL,
    "rankPosition" INTEGER NOT NULL,
    "matchedRequiredSkills" TEXT NOT NULL,
    "matchedOptionalSkills" TEXT NOT NULL,
    "missingRequiredSkills" TEXT NOT NULL,
    "matchReasonSummary" TEXT NOT NULL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_ml_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_applicant_analytics" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "totalApplicants" INTEGER NOT NULL DEFAULT 0,
    "totalViewed" INTEGER NOT NULL DEFAULT 0,
    "totalShortlisted" INTEGER NOT NULL DEFAULT 0,
    "totalInterview" INTEGER NOT NULL DEFAULT 0,
    "totalAccepted" INTEGER NOT NULL DEFAULT 0,
    "totalRejected" INTEGER NOT NULL DEFAULT 0,
    "avgMatchScore" DECIMAL(5,2),
    "topApplicantScore" DECIMAL(5,2),
    "lastApplicationAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_applicant_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_scores" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "context" "RecommendationContext" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER,
    "matchedSkills" JSONB,
    "missingSkills" JSONB,
    "reason" TEXT,
    "modelVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "thumbnailUrl" TEXT,
    "priceAmount" DECIMAL(10,2) NOT NULL,
    "priceCurrency" TEXT NOT NULL DEFAULT 'LKR',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_modules" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "moduleOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_lessons" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentUrl" TEXT,
    "lessonOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_enrollments" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "enrollmentStatus" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boost_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "boostWeight" INTEGER NOT NULL DEFAULT 10,
    "priceAmount" DECIMAL(10,2) NOT NULL,
    "priceCurrency" TEXT NOT NULL DEFAULT 'LKR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "boost_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boosted_posts" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "paymentId" TEXT,
    "packageId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "BoostStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boosted_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "courseId" TEXT,
    "boostPackageId" TEXT,
    "name" TEXT NOT NULL,
    "priceAmount" DECIMAL(10,2) NOT NULL,
    "priceCurrency" TEXT NOT NULL DEFAULT 'LKR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userType" "PaymentUserType" NOT NULL,
    "studentId" TEXT,
    "companyId" TEXT,
    "productId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'LKR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "eventId" TEXT NOT NULL,
    "paymentId" TEXT,
    "eventType" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE INDEX "resumes_studentId_idx" ON "resumes"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "student_skills_studentId_skillId_key" ON "student_skills"("studentId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_corporateEmail_key" ON "companies"("corporateEmail");

-- CreateIndex
CREATE UNIQUE INDEX "companies_userId_key" ON "companies"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_verifications_companyId_key" ON "company_verifications"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "company_profiles_companyId_key" ON "company_profiles"("companyId");

-- CreateIndex
CREATE INDEX "internship_posts_companyId_idx" ON "internship_posts"("companyId");

-- CreateIndex
CREATE INDEX "post_required_skills_postId_idx" ON "post_required_skills"("postId");

-- CreateIndex
CREATE INDEX "post_optional_skills_postId_idx" ON "post_optional_skills"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "post_skills_postId_skillId_key" ON "post_skills"("postId", "skillId");

-- CreateIndex
CREATE INDEX "applications_postId_idx" ON "applications"("postId");

-- CreateIndex
CREATE INDEX "applications_studentId_idx" ON "applications"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "applications_postId_studentId_key" ON "applications"("postId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "application_ml_scores_applicationId_key" ON "application_ml_scores"("applicationId");

-- CreateIndex
CREATE INDEX "application_ml_scores_postId_idx" ON "application_ml_scores"("postId");

-- CreateIndex
CREATE INDEX "application_ml_scores_studentId_idx" ON "application_ml_scores"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "post_applicant_analytics_postId_key" ON "post_applicant_analytics"("postId");

-- CreateIndex
CREATE INDEX "recommendation_scores_studentId_context_idx" ON "recommendation_scores"("studentId", "context");

-- CreateIndex
CREATE INDEX "recommendation_scores_postId_context_idx" ON "recommendation_scores"("postId", "context");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_scores_studentId_postId_context_key" ON "recommendation_scores"("studentId", "postId", "context");

-- CreateIndex
CREATE INDEX "course_modules_courseId_idx" ON "course_modules"("courseId");

-- CreateIndex
CREATE INDEX "course_lessons_moduleId_idx" ON "course_lessons"("moduleId");

-- CreateIndex
CREATE INDEX "course_enrollments_studentId_idx" ON "course_enrollments"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_courseId_studentId_key" ON "course_enrollments"("courseId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_studentId_lessonId_key" ON "lesson_progress"("studentId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "boosted_posts_paymentId_key" ON "boosted_posts"("paymentId");

-- CreateIndex
CREATE INDEX "boosted_posts_postId_idx" ON "boosted_posts"("postId");

-- CreateIndex
CREATE INDEX "boosted_posts_companyId_idx" ON "boosted_posts"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerPaymentId_key" ON "payments"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payments_studentId_idx" ON "payments"("studentId");

-- CreateIndex
CREATE INDEX "payments_companyId_idx" ON "payments"("companyId");

-- CreateIndex
CREATE INDEX "payments_productId_idx" ON "payments"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_events_eventId_key" ON "payment_events"("eventId");

-- CreateIndex
CREATE INDEX "payment_events_paymentId_idx" ON "payment_events"("paymentId");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_verifications" ADD CONSTRAINT "company_verifications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_posts" ADD CONSTRAINT "internship_posts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_required_skills" ADD CONSTRAINT "post_required_skills_postId_fkey" FOREIGN KEY ("postId") REFERENCES "internship_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_optional_skills" ADD CONSTRAINT "post_optional_skills_postId_fkey" FOREIGN KEY ("postId") REFERENCES "internship_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_skills" ADD CONSTRAINT "post_skills_postId_fkey" FOREIGN KEY ("postId") REFERENCES "internship_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_skills" ADD CONSTRAINT "post_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "internship_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_ml_scores" ADD CONSTRAINT "application_ml_scores_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_ml_scores" ADD CONSTRAINT "application_ml_scores_postId_fkey" FOREIGN KEY ("postId") REFERENCES "internship_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_ml_scores" ADD CONSTRAINT "application_ml_scores_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_applicant_analytics" ADD CONSTRAINT "post_applicant_analytics_postId_fkey" FOREIGN KEY ("postId") REFERENCES "internship_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_scores" ADD CONSTRAINT "recommendation_scores_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_scores" ADD CONSTRAINT "recommendation_scores_postId_fkey" FOREIGN KEY ("postId") REFERENCES "internship_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "course_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "course_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boosted_posts" ADD CONSTRAINT "boosted_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "internship_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boosted_posts" ADD CONSTRAINT "boosted_posts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boosted_posts" ADD CONSTRAINT "boosted_posts_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boosted_posts" ADD CONSTRAINT "boosted_posts_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "boost_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_boostPackageId_fkey" FOREIGN KEY ("boostPackageId") REFERENCES "boost_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
