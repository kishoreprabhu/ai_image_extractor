import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { LLMService } from '../../llm/llm.service';
import { supabase } from '../../../config/supabase.config';
import { ExtractStatus } from 'src/types/receiptschema/receipt.types';
import { receiptSchema } from 'src/types/receiptschema/receipt.types';

@Processor('extractor')
export class ExtractorProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llm: LLMService,
  ) { super(); }

  async process(job) {
    const { id, filePath, mimeType } = job.data;
    try {
      const { data: fileToProcess } = await supabase.storage
                                      .from(process.env.SUPABASE_BUCKET)
                                      .download(filePath);
      const rawData = await this.llm.extractReceiptData(fileToProcess, mimeType);
      const extracted = receiptSchema.safeParse(rawData);
      console.log(extracted, "response from LLM")

      // Validate structured output
      if (!extracted.success) {
        await this.prisma.userUpload.update({
          where: { id },
          data: {
            status: ExtractStatus.INVALID
          }
        });
      } else {
        await this.prisma.userUpload.update({
          where: { id },
          data: {
            status: ExtractStatus.EXTRACTED
          }
        });

        await this.prisma.receiptExtraction.create({
           data: {
            uploadId: id,
            extractedJson: extracted
          }
        })
      }

    } catch (err) {
      console.log(err, "error from LLM")
      await this.prisma.userUpload.update({
        where: { id },
        data: { 
          status: ExtractStatus.FAILED
        }
      });
    }
  }
}
