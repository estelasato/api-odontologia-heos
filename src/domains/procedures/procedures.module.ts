import { Module } from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import { ProceduresController } from './procedures.controller';
import { DatabaseModule } from 'src/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProceduresController],
  providers: [ProceduresService],
})
export class ProceduresModule {}
