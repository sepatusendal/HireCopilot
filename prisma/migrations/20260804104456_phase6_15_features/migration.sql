-- AlterTable
ALTER TABLE "application" ADD COLUMN     "answers" JSONB,
ADD COLUMN     "applyProofUrl" TEXT,
ADD COLUMN     "applyStatus" TEXT,
ADD COLUMN     "atsReportId" TEXT,
ADD COLUMN     "portfolioOrder" JSONB,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "isWatched" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "cover_letter" ADD COLUMN     "fileUrl" TEXT;

-- AlterTable
ALTER TABLE "project_item" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ats_report" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "missingKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keywordDensity" JSONB,
    "suggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ats_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_answer" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaire_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_briefing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "summary" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_briefing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_answer_profileId_question_key" ON "questionnaire_answer"("profileId", "question");

-- CreateIndex
CREATE UNIQUE INDEX "daily_briefing_userId_date_key" ON "daily_briefing"("userId", "date");

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_atsReportId_fkey" FOREIGN KEY ("atsReportId") REFERENCES "ats_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ats_report" ADD CONSTRAINT "ats_report_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_answer" ADD CONSTRAINT "questionnaire_answer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight" ADD CONSTRAINT "insight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_briefing" ADD CONSTRAINT "daily_briefing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
