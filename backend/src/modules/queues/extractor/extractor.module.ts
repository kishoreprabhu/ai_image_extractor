import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ExtractorProcessor } from './extractor.processor';
import { PrismaService } from '../../../database/prisma.service';
import { LLMModule } from '../../llm/llm.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'extractor',
    }),
    LLMModule,
  ],
  exports:[ 
    ExtractorProcessor,
    PrismaService,
    BullModule,
  ],
  providers: [
    ExtractorProcessor,
    PrismaService
  ],
})
export class ExtractorModule {}
