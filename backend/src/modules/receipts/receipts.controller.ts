import {
  Controller, Post, UploadedFile, UseInterceptors,
  BadRequestException,UseGuards, Get, Request,
  Delete, Param, Body, HttpCode
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptsService } from './receipts.service';
import { SupabaseAuthGuard } from 'src/modules/auth/guards/supase.guard';
import { AuthService } from '../auth/auth.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService,
    private readonly authService: AuthService
  ) {}

  // API to upload receipt
  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(SupabaseAuthGuard)
  async addReceipt(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    const userId:string = this.authService.getUserId(req);
    if (!file) throw new BadRequestException('File is required');
    if (!userId) throw new BadRequestException('userId required');

    return this.receiptsService.addReceipt(file, userId);
  }

  // API to get all the uploaded list of user
  @Get()
  @HttpCode(200)
  @UseGuards(SupabaseAuthGuard)
  async getAllReceiptsByUser(@Request() req) {
    const userId:string = this.authService.getUserId(req);
    //console.log(userId);
    return {
      data: await this.receiptsService.getAllReceiptsByUser(userId)
    };
  }

  // API to delete the receipt and associated AI response from DB 
  @Delete("/:itemId")
  @HttpCode(200)
  @UseGuards(SupabaseAuthGuard)
  async deleteReceiptById(@Param("itemId") itemId:string) {
    return {
      data: await this.receiptsService.deleteReceipt(itemId)
    };
  }

  // API to fetch teh status of receipts started to process
  @Post("/checkStatus")
  @HttpCode(200)
  @UseGuards(SupabaseAuthGuard)
  async checkStatus(@Body('ids') ids: string[]) {
    //console.log(ids, "backend")
    return {
      data: await this.receiptsService.getReceiptsByIds(ids)
    };
  }

}
