-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('ANY', 'ONSITE', 'REMOTE', 'HYBRID');

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "workMode" "WorkMode" NOT NULL DEFAULT 'ONSITE';

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "preferredWorkMode" "WorkMode" NOT NULL DEFAULT 'ANY';
