/*
  Warnings:

  - The values [DONE] on the enum `UploadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UploadStatus_new" AS ENUM ('EXTRACTING', 'EXTRACTED', 'FAILED', 'INVALID');
ALTER TABLE "public"."user_uploads" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user_uploads" ALTER COLUMN "status" TYPE "UploadStatus_new" USING ("status"::text::"UploadStatus_new");
ALTER TYPE "UploadStatus" RENAME TO "UploadStatus_old";
ALTER TYPE "UploadStatus_new" RENAME TO "UploadStatus";
DROP TYPE "public"."UploadStatus_old";
ALTER TABLE "user_uploads" ALTER COLUMN "status" SET DEFAULT 'EXTRACTING';
COMMIT;
