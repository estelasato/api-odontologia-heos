import { Test, TestingModule } from '@nestjs/testing';
import { MedAnamnesisService } from './med_anamnesis.service';

describe('MedAnamnesisService', () => {
  let service: MedAnamnesisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedAnamnesisService],
    }).compile();

    service = module.get<MedAnamnesisService>(MedAnamnesisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
