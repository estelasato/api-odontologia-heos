import { Module } from '@nestjs/common';

import { DatabaseModule } from './db.module';
import { CountryController } from './domains/country/country.controller';
import { CountryService } from './domains/country/country.service';
import { StateController } from './domains/state/state.controller';
import { StateService } from './domains/state/state.service';
import { CityController } from './domains/city/city.controller';
import { CityService } from './domains/city/city.service';
import { EmployeeController } from './employee/employee.controller';
import { EmployeeService } from './employee/employee.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CountryController, StateController, CityController, EmployeeController],
  providers: [CountryService, StateService, CityService, EmployeeService],

})
export class AppModule {}
