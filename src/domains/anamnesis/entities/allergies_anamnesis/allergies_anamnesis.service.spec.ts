import { Test, TestingModule } from '@nestjs/testing';
import { AllergiesAnamnesisService } from './allergies_anamnesis.service';

describe('AllergiesAnamnesisService', () => {
  let service: AllergiesAnamnesisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllergiesAnamnesisService],
    }).compile();

    service = module.get<AllergiesAnamnesisService>(AllergiesAnamnesisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
