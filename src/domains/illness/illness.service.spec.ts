import { Test, TestingModule } from '@nestjs/testing';
import { IllnessService } from './illness.service';

describe('IllnessService', () => {
  let service: IllnessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IllnessService],
    }).compile();

    service = module.get<IllnessService>(IllnessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
