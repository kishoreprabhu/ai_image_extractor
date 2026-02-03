/*
  Warnings:

  - You are about to drop the `UserUploads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserUploads";

-- CreateTable
CREATE TABLE "user_uploads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_uploads_pkey" PRIMARY KEY ("id")
);
