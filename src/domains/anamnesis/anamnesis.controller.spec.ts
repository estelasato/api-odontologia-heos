import { Test, TestingModule } from '@nestjs/testing';
import { AnamnesisController } from './anamnesis.controller';
import { AnamnesisService } from './anamnesis.service';

describe('AnamnesisController', () => {
  let controller: AnamnesisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnamnesisController],
      providers: [AnamnesisService],
    }).compile();

    controller = module.get<AnamnesisController>(AnamnesisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
