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
import { MedicationsController } from './domains/medications/medications.controller';
import { HabitController } from './domains/habit/habit.controller';
import { AllergyController } from './domains/allergy/allergy.controller';
import { HabitService } from './domains/habit/habit.service';
import { AllergyService } from './domains/allergy/allergy.service';
import { PatientController } from './domains/patient/patient.controller';
import { PatientService } from './domains/patient/patient.service';
import { ProfessionalController } from './domains/professional/professional.controller';
import { ProfessionalService } from './domains/professional/professional.service';
import { ResponsiblePartyController } from './domains/responsible-party/responsible-party.controller';
import { ResponsiblePartyService } from './domains/responsible-party/responsible-party.service';
import { ScheduleController } from './domains/schedule/schedule.controller';
import { ScheduleService } from './domains/schedule/schedule.service';
import { TreatmentsController } from './domains/treatments/treatments.controller';
import { TreatmentsService } from './domains/treatments/treatments.service';
import { AnamnesisController } from './domains/anamnesis/anamnesis.controller';
import { AnamnesisService } from './domains/anamnesis/anamnesis.service';
import { ExamsController } from './domains/exams/exams.controller';
import { ExamsService } from './domains/exams/exams.service';
import { IllnessAnamnesisService } from './domains/anamnesis/entities/illness_anamnesis/illness_anamnesis.service';
import { MedicationsService } from './domains/medications/medications.service';
import { MedAnamnesisService } from './domains/anamnesis/entities/med_anamnesis/med_anamnesis.service';
import { AllergiesAnamnesisService } from './domains/anamnesis/entities/allergies_anamnesis/allergies_anamnesis.service';
import { PaymentMethodsController } from './domains/payment-methods/payment-methods.controller';
import { PaymentMethodsService } from './domains/payment-methods/payment-methods.service';
import { PaymentTermsService } from './domains/payment-terms/payment-terms.service';
import { PaymentTermsController } from './domains/payment-terms/payment-terms.controller';
import { BudgetsController } from './domains/budgets/budgets.controller';
import { BudgetsService } from './domains/budgets/budgets.service';
import { InstallmentsController } from './domains/installments/installments.controller';
import { InstallmentsService } from './domains/installments/installments.service';
import { BudgetTreatmentsService } from './domains/budgets/entities/budget-treatments/budget-treatments.service';
import { AccReceivableService } from './domains/acc-receivable/acc-receivable.service';
import { AccReceivableController } from './domains/acc-receivable/acc-receivable.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CountryController,
    StateController,
    CityController,
    EmployeeController,
    IllnessController,
    MedicationsController,
    HabitController,
    AllergyController,
    PatientController,
    ProfessionalController,
    ResponsiblePartyController,
    ScheduleController,
    TreatmentsController,
    AnamnesisController,
    ExamsController,
    PaymentMethodsController,
    PaymentTermsController,
    BudgetsController,
    InstallmentsController,
    AccReceivableController,
  ],
  providers: [
    CountryService,
    StateService,
    CityService,
    EmployeeService,
    IllnessService,
    MedicationsService,
    HabitService,
    AllergyService,
    PatientService,
    ProfessionalService,
    ResponsiblePartyService,
    ScheduleService,
    TreatmentsService,
    AnamnesisService,
    ExamsService,
    IllnessAnamnesisService,
    MedAnamnesisService,
    AllergiesAnamnesisService,
    PaymentMethodsService,
    PaymentTermsService,
    BudgetsService,
    InstallmentsService,
    BudgetTreatmentsService,
    AccReceivableService
  ],
})
export class AppModule {}
