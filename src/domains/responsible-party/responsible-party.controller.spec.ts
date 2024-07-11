import { Test, TestingModule } from '@nestjs/testing';
import { ResponsiblePartyController } from './responsible-party.controller';
import { ResponsiblePartyService } from './responsible-party.service';

describe('ResponsiblePartyController', () => {
  let controller: ResponsiblePartyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsiblePartyController],
      providers: [ResponsiblePartyService],
    }).compile();

    controller = module.get<ResponsiblePartyController>(ResponsiblePartyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
