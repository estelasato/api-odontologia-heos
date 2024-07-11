import { Test, TestingModule } from '@nestjs/testing';
import { ResponsiblePartyService } from './responsible-party.service';

describe('ResponsiblePartyService', () => {
  let service: ResponsiblePartyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponsiblePartyService],
    }).compile();

    service = module.get<ResponsiblePartyService>(ResponsiblePartyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
