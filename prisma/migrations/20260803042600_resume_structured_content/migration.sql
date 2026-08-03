-- AlterTable
ALTER TABLE "resume" ADD COLUMN     "content" JSONB,
ALTER COLUMN "fileUrl" DROP NOT NULL;
