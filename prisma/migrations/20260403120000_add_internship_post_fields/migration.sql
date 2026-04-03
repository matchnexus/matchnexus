-- CreateEnum
CREATE TYPE "InternshipCategory" AS ENUM ('COMPUTING', 'BUSINESS', 'ENGINEERING');

-- AlterTable
ALTER TABLE "internship_posts"
ADD COLUMN "techStack" TEXT,
ADD COLUMN "category" "InternshipCategory",
ADD COLUMN "keyRequirements" TEXT;
