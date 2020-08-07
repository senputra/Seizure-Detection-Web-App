import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { PatientDoctorRegisterPageComponent } from './patient-doctor-register-page/patient-doctor-register-page.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  { path: 'check-in', component: PatientDoctorRegisterPageComponent },
];

export const LoginRoutes = RouterModule.forChild(routes);

@NgModule({
  imports: [LoginRoutes],
  exports: [RouterModule],
})
class LoginRoutingModule {}

@NgModule({
  imports: [SharedModule, LoginRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [LoginComponent, PatientDoctorRegisterPageComponent],
})
export class LoginModule {}
