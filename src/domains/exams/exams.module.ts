import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { DatabaseModule } from 'src/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
