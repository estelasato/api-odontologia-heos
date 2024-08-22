import { Test, TestingModule } from '@nestjs/testing';
import { AnamnesisService } from './anamnesis.service';

describe('AnamnesisService', () => {
  let service: AnamnesisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnamnesisService],
    }).compile();

    service = module.get<AnamnesisService>(AnamnesisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
