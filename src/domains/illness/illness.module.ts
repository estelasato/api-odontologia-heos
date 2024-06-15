import { Module } from '@nestjs/common';
import { IllnessService } from './illness.service';
import { IllnessController } from './illness.controller';

@Module({
  controllers: [IllnessController],
  providers: [IllnessService],
})
export class IllnessModule {}
