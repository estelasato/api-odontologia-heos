import { Module } from '@nestjs/common';

import { DatabaseModule } from './db.module';
import { CountryController } from './domains/country/country.controller';
import { CountryService } from './domains/country/country.service';
import { StateController } from './domains/state/state.controller';
import { StateService } from './domains/state/state.service';
import { CityController } from './domains/city/city.controller';
import { CityService } from './domains/city/city.service';
import { EmployeeController } from './domains/employee/employee.controller';
import { EmployeeService } from './domains/employee/employee.service';
import { IllnessController } from './domains/illness/illness.controller';
import { IllnessService } from './domains/illness/illness.service';
import { MedicationController } from './domains/medication/medication.controller';
import { HabitController } from './domains/habit/habit.controller';
import { AllergyController } from './domains/allergy/allergy.controller';
import { MedicationService } from './domains/medication/medication.service';
import { HabitService } from './domains/habit/habit.service';
import { AllergyService } from './domains/allergy/allergy.service';
import { PatientController } from './domains/patient/patient.controller';
import { PatientService } from './domains/patient/patient.service';
import { ProfessionalController } from './domains/professional/professional.controller';
import { ProfessionalService } from './domains/professional/professional.service';
import { ResponsiblePartyController } from './domains/responsible-party/responsible-party.controller';
import { ResponsiblePartyService } from './domains/responsible-party/responsible-party.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CountryController,
    StateController,
    CityController,
    EmployeeController,
    IllnessController,
    MedicationController,
    HabitController,
    AllergyController,
    PatientController,
    ProfessionalController,
    ResponsiblePartyController,
  ],
  providers: [
    CountryService,
    StateService,
    CityService,
    EmployeeService,
    IllnessService,
    MedicationService,
    HabitService,
    AllergyService,
    PatientService,
    ProfessionalService,
    ResponsiblePartyService,
  ],
})
export class AppModule {}
