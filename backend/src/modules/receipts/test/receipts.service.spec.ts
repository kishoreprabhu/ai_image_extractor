import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptsService } from '../receipts.service';
import { PrismaService } from '../../../database/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { supabase } from '../../../config/supabase.config';

// mock supabasse 
jest.mock('../../../config/supabase.config', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
      remove: jest.fn(),
    },
  },
}));

describe('ReceiptsService', () => {
  let service: ReceiptsService;
  let prisma: PrismaService;
  let queue: any;

  const mockPrisma = {
    userUpload: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: getQueueToken('extractor'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<ReceiptsService>(ReceiptsService);
    prisma = module.get<PrismaService>(PrismaService);
    queue = module.get(getQueueToken('extractor'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addReceipt', () => {
    const mockFile = {
      mimetype: 'image/jpeg',
      originalname: 'test.jpg',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    it('should throw BadRequest if file type is invalid', async () => {
      const invalidFile = { ...mockFile, mimetype: 'application/pdf' } as any;
      await expect(service.addReceipt(invalidFile, 'user123')).rejects.toThrow(BadRequestException);
    });

    it('should upload to supabase and save to DB', async () => {
      // mock supabase success
      (supabase.storage.from('').upload as jest.Mock).mockResolvedValue({ data: {}, error: null });
      (supabase.storage.from('').getPublicUrl as jest.Mock).mockReturnValue({ data: { publicUrl: 'http://url.com' } });
      
      const mockRecord = { id: 'rec123', fileType: 'image/jpeg' };
      mockPrisma.userUpload.create.mockResolvedValue(mockRecord);

      const result = await service.addReceipt(mockFile, 'user123');

      expect(supabase.storage.from).toHaveBeenCalled();
      expect(mockPrisma.userUpload.create).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith('start-extraction', expect.any(Object));
      expect(result.message).toBe('Uploaded & saved successfully');
    });
  });

  describe('deleteReceipt', () => {
    it('should throw NotFound if receipt does not exist', async () => {
      mockPrisma.userUpload.findUnique.mockResolvedValue(null);
      await expect(service.deleteReceipt('id1')).rejects.toThrow(NotFoundException);
    });

    it('should delete from storage and database', async () => {
      const mockReceipt = { id: 'id1', storagePath: 'path/to/file' };
      mockPrisma.userUpload.findUnique.mockResolvedValue(mockReceipt);
      (supabase.storage.from('').remove as jest.Mock).mockResolvedValue({ error: null });

      await service.deleteReceipt('id1');

      expect(supabase.storage.from('').remove).toHaveBeenCalledWith([mockReceipt.storagePath]);
      expect(mockPrisma.userUpload.delete).toHaveBeenCalledWith({ where: { id: 'id1' } });
    });
  });
});