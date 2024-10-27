import { Module } from '@nestjs/common';
import { IllnessService } from './illness.service';
import { IllnessController } from './illness.controller';
import { DatabaseModule } from 'src/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IllnessController],
  providers: [IllnessService],
  exports: [IllnessService],
})
export class IllnessModule {}
