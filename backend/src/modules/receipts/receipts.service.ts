import { Injectable, BadRequestException, NotFoundException
  , InternalServerErrorException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as path from 'path';

import { supabase } from '../../config/supabase.config';
import { PrismaService } from '../../database/prisma.service';


@Injectable()
export class ReceiptsService {
  constructor(
      private prisma: PrismaService,  
      
      @InjectQueue('extractor') private extractorQueue: Queue
  ) {}

  private allowedTypes:string[] = ['image/jpeg', 'image/png', 'image/jpg'];

  // function to handle single receipt file upload and to create the same
  async addReceipt(file: Express.Multer.File, userId: string) {
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const fileExt:string = path.extname(file.originalname);
    const filePath:string = `${userId}/${Date.now()}${fileExt}`;

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw new BadRequestException(error.message);

    const { data: publicData } = supabase.storage
                                          .from(process.env.SUPABASE_BUCKET!)
                                          .getPublicUrl(filePath);


    //console.log(fileToProcess, "fileToProcess");
    // Inserting file details into DB
    const record = await this.prisma.userUpload.create({
      data: {
        userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        storagePath: filePath,
        publicUrl: publicData.publicUrl
      },
    });


    // calling the background queue for extraction
    this.addJobToQueue(record, filePath);

    return {
      message: 'Uploaded & saved successfully',
      receipt: record,
    };
  }
  
  // function to get all the uploaded receipts by userid 
  async getAllReceiptsByUser(userId: string, pageNo:number = 1, pageLimit:number = 10) {
      const safePage = Math.max(pageNo, 1);
      const safeLimit = Math.min(Math.max(pageLimit, 1), 50);
      const skip = (safePage - 1) * safeLimit;

      const whereClause = { userId };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.userUpload.findMany({
          where: whereClause,
          orderBy: { uploadedAt: 'desc' },
          skip,
          take: safeLimit,
          select: {
            id: true,
            fileName: true,
            fileType: true,
            publicUrl: true,
            status: true,
            uploadedAt: true,
            extraction: {
              select: {
                id: true,
                extractedJson: true
              }
            }
          },
        }),
        this.prisma.userUpload.count({
          where: whereClause,
        }),
      ]);

      return {
        items,
        meta: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
          hasNextPage: skip + items.length < total,
          hasPrevPage: safePage > 1,
        },
      };
  }

  // function to add job to queue 
  async addJobToQueue(dbRecord, filePath) {
    console.log(filePath, "file to process")
    await this.extractorQueue.add('start-extraction', {
      id: dbRecord.id,
      filePath,
      mimeType: dbRecord.fileType
    });
  }

  // function to delete the upload receipt and AI response associated
  async deleteReceipt(itemId: string) {
     const whereClause = {id: itemId};

     const receipt = await this.prisma.userUpload.findUnique({
        where: whereClause
     });

     if(!receipt) {
       throw new NotFoundException("Receipt Not Found");
     }

     const {error: storageErr} = await supabase
                                          .storage.from(process.env.SUPABASE_BUCKET!)
                                          .remove([receipt.storagePath])
    
      if(storageErr) {
        throw new InternalServerErrorException("Failed to delete the receipt")
      }

      return this.prisma.userUpload.delete({
        where: whereClause
      });
  }

  // function to get receipts status
  async getReceiptsByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    return this.prisma.userUpload.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        publicUrl: true,
        uploadedAt: true,
        status: true,
        extraction: true, 
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

}
