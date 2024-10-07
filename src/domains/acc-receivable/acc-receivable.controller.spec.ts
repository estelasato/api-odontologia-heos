import { Test, TestingModule } from '@nestjs/testing';
import { AccReceivableController } from './acc-receivable.controller';
import { AccReceivableService } from './acc-receivable.service';

describe('AccReceivableController', () => {
  let controller: AccReceivableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccReceivableController],
      providers: [AccReceivableService],
    }).compile();

    controller = module.get<AccReceivableController>(AccReceivableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
