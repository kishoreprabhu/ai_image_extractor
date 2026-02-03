import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './database/prisma.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ExtractorModule } from './modules/queues/extractor/extractor.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, ReceiptsModule, ExtractorModule,  AuthModule, BullModule.forRoot({
      connection: { url: process.env.REDIS_URL },
    })]
})
export class AppModule {}