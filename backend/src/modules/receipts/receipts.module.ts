import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { PrismaService } from '../../database/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ExtractorModule } from '../queues/extractor/extractor.module';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [ExtractorModule, LLMModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService, PrismaService, AuthService],
})
export class ReceiptsModule {}
