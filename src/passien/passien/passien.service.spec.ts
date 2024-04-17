import { Test, TestingModule } from '@nestjs/testing';
import { PassienService } from './passien.service';

describe('PassienService', () => {
  let service: PassienService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassienService],
    }).compile();

    service = module.get<PassienService>(PassienService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
