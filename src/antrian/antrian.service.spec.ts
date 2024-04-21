import { Test, TestingModule } from '@nestjs/testing';
import { AntrianService } from './antrian.service';

describe('AntrianService', () => {
  let service: AntrianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntrianService],
    }).compile();

    service = module.get<AntrianService>(AntrianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
