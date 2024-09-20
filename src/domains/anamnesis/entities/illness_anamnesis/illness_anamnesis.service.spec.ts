import { Test, TestingModule } from '@nestjs/testing';
import { IllnessAnamnesisService } from './illness_anamnesis.service';

describe('IllnessAnamnesisService', () => {
  let service: IllnessAnamnesisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IllnessAnamnesisService],
    }).compile();

    service = module.get<IllnessAnamnesisService>(IllnessAnamnesisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
