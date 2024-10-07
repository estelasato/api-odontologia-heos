import { Test, TestingModule } from '@nestjs/testing';
import { AccReceivableService } from './acc-receivable.service';

describe('AccReceivableService', () => {
  let service: AccReceivableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccReceivableService],
    }).compile();

    service = module.get<AccReceivableService>(AccReceivableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
