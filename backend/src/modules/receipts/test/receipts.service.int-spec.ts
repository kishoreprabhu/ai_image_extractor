import * as dotenv from 'dotenv';

import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptsService } from '../receipts.service';
import { PrismaService } from '../../../database/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';

dotenv.config();

// mock supabase to avoid cloud network calls
jest.mock('../../../config/supabase.config', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'http://test.com' } }),
      remove: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));

describe('ReceiptsService Integration', () => {
  let service: ReceiptsService;
  let prisma: PrismaService;

  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: 'job-id' }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptsService,
        PrismaService, 
        { provide: getQueueToken('extractor'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<ReceiptsService>(ReceiptsService);
    prisma = module.get<PrismaService>(PrismaService);

    
    await prisma.userUpload.deleteMany();
  });

  afterAll(async () => {
    // cleanup and disconnect
    await prisma.receiptExtraction.deleteMany();
    await prisma.userUpload.deleteMany();
    await prisma.$disconnect();
  });

  describe('addReceipt & Database Persistence', () => {
    it('should save a record to the real database and return it', async () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        originalname: 'receipt.jpg',
        buffer: Buffer.from('test-data'),
      } as any;

      const userId = 'user-unique-123';
      
      const result = await service.addReceipt(mockFile, userId);

      // verifying the return object
      expect(result.message).toBe('Uploaded & saved successfully');
      
      // verifying db presistance
      const dbRecord = await prisma.userUpload.findUnique({
        where: { id: result.receipt.id }
      });

      expect(dbRecord).toBeDefined();
      expect(dbRecord?.userId).toBe(userId);
      expect(dbRecord?.fileName).toBe('receipt.jpg');
    });
  });

  describe('getAllReceiptsByUser Pagination', () => {
    it('should correctly paginate results from the database', async () => {
      const userId = '27dbd599-6454-4570-a733-19955c239bd9';
      
      // push 3 records
      await prisma.userUpload.createMany({
        data: [
          { userId, fileName: '1.jpg', fileType: 'image/jepg', storagePath: 'p1', publicUrl: 'u1' },
          { userId, fileName: '2.jpg', fileType: 'image/jepg', storagePath: 'p2', publicUrl: 'u2' },
          { userId, fileName: '3.jpg', fileType: 'image/jepg', storagePath: 'p3', publicUrl: 'u3' },
        ]
      });

      const result = await service.getAllReceiptsByUser(userId, 1, 2);

      expect(result.items.length).toBe(2);
      expect(result.meta.total).toBe(3);
      expect(result.meta.totalPages).toBe(2);
    });
  });
});