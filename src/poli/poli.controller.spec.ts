import { Test, TestingModule } from '@nestjs/testing';
import { PoliController } from './poli.controller';

describe('PoliController', () => {
  let controller: PoliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoliController],
    }).compile();

    controller = module.get<PoliController>(PoliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
