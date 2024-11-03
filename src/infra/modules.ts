import { AccReceivableModule } from "src/domains/acc-receivable/acc-receivable.module";
import { AllergyModule } from "src/domains/allergy/allergy.module";
import { AnamnesisModule } from "src/domains/anamnesis/anamnesis.module";
import { BudgetsModule } from "src/domains/budgets/budgets.module";
import { CityModule } from "src/domains/city/city.module";
import { CountryModule } from "src/domains/country/country.module";
import { EmployeeModule } from "src/domains/employee/employee.module";
import { ExamsModule } from "src/domains/exams/exams.module";
import { HabitModule } from "src/domains/habit/habit.module";
import { IllnessModule } from "src/domains/illness/illness.module";
import { InstallmentsModule } from "src/domains/installments/installments.module";
import { MedicationsModule } from "src/domains/medications/medications.module";
import { PatientModule } from "src/domains/patient/patient.module";
import { PaymentMethodsModule } from "src/domains/payment-methods/payment-methods.module";
import { PaymentTermsModule } from "src/domains/payment-terms/payment-terms.module";
import { ProceduresModule } from "src/domains/procedures/procedures.module";
import { ProfessionalModule } from "src/domains/professional/professional.module";
import { ResponsiblePartyModule } from "src/domains/responsible-party/responsible-party.module";
import { ScheduleModule } from "src/domains/schedule/schedule.module";
import { StateModule } from "src/domains/state/state.module";
import { TreatmentsModule } from "src/domains/treatments/treatments.module";
import { UsuariosModule } from "src/domains/usuarios/usuarios.module";
import { TokenModule } from "src/shared/token/token.module";

export const modules = [
  AccReceivableModule,
  AnamnesisModule,
  AllergyModule,
  BudgetsModule,
  CityModule,
  CountryModule,
  EmployeeModule,
  ExamsModule,
  HabitModule,
  IllnessModule,
  InstallmentsModule,
  MedicationsModule,
  PatientModule,
  PaymentMethodsModule,
  PaymentTermsModule,
  ProfessionalModule,
  StateModule,
  ScheduleModule,
  ResponsiblePartyModule,
  TreatmentsModule,
  TokenModule,
  UsuariosModule,
  ProceduresModule,
]