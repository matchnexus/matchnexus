DO $$
BEGIN
    CREATE TYPE "NotificationAudience" AS ENUM ('ALL_STUDENTS');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE "NotificationLevel" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ALERT');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "level" "NotificationLevel" NOT NULL DEFAULT 'INFO',
    "audience" "NotificationAudience" NOT NULL DEFAULT 'ALL_STUDENTS',
    "publishAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByAdminProfileId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "notification_reads" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_reads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "notifications_audience_publishAt_idx" ON "notifications"("audience", "publishAt");

CREATE INDEX IF NOT EXISTS "notifications_createdByAdminProfileId_idx" ON "notifications"("createdByAdminProfileId");

CREATE UNIQUE INDEX IF NOT EXISTS "notification_reads_notificationId_studentId_key" ON "notification_reads"("notificationId", "studentId");

CREATE INDEX IF NOT EXISTS "notification_reads_studentId_idx" ON "notification_reads"("studentId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'notifications_createdByAdminProfileId_fkey'
    ) THEN
        ALTER TABLE "notifications"
            ADD CONSTRAINT "notifications_createdByAdminProfileId_fkey"
            FOREIGN KEY ("createdByAdminProfileId") REFERENCES "admin_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'notification_reads_notificationId_fkey'
    ) THEN
        ALTER TABLE "notification_reads"
            ADD CONSTRAINT "notification_reads_notificationId_fkey"
            FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'notification_reads_studentId_fkey'
    ) THEN
        ALTER TABLE "notification_reads"
            ADD CONSTRAINT "notification_reads_studentId_fkey"
            FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
