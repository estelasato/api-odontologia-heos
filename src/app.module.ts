import { Module } from '@nestjs/common';

import { DatabaseModule } from './db.module';
import { CountryController } from './country/country.controller';
import { CountryService } from './country/country.service';
import { StateController } from './domains/state/state.controller';
import { StateService } from './domains/state/state.service';
import { CityController } from './domains/city/city.controller';
import { CityService } from './domains/city/city.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CountryController, StateController, CityController],
  providers: [CountryService, StateService, CityService],

})
export class AppModule {}
