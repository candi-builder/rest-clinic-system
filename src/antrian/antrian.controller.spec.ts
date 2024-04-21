import { Test, TestingModule } from '@nestjs/testing';
import { AntrianController } from './antrian.controller';

describe('AntrianController', () => {
  let controller: AntrianController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntrianController],
    }).compile();

    controller = module.get<AntrianController>(AntrianController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
