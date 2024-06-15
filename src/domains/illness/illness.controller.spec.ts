import { Test, TestingModule } from '@nestjs/testing';
import { IllnessController } from './illness.controller';
import { IllnessService } from './illness.service';

describe('IllnessController', () => {
  let controller: IllnessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IllnessController],
      providers: [IllnessService],
    }).compile();

    controller = module.get<IllnessController>(IllnessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
