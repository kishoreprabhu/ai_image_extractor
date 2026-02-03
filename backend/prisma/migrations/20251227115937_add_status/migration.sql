-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('EXTRACTING', 'DONE', 'FAILED', 'INVALID');

-- AlterTable
ALTER TABLE "user_uploads" ADD COLUMN     "status" "UploadStatus" NOT NULL DEFAULT 'EXTRACTING';
