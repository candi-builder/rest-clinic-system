import { Test, TestingModule } from '@nestjs/testing';
import { PoliService } from './poli.service';

describe('PoliService', () => {
  let service: PoliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoliService],
    }).compile();

    service = module.get<PoliService>(PoliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
