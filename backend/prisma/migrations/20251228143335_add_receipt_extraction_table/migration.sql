-- CreateTable
CREATE TABLE "receipt_extraction" (
    "id" TEXT NOT NULL,
    "upload_id" TEXT NOT NULL,
    "extracted_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_extraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "receipt_extraction_upload_id_key" ON "receipt_extraction"("upload_id");

-- AddForeignKey
ALTER TABLE "receipt_extraction" ADD CONSTRAINT "receipt_extraction_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "user_uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
