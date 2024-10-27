import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { DatabaseModule } from 'src/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService]
})
export class CityModule {}
