import { createAction, props } from '@ngrx/store';
import { DoctorType } from '@core/models';

export const LoginWithSecretKey = createAction(
  '[User Frontend Triggered] User login attempt with unique key',
  props<{ secretKey: string }>(),
);

export const GeneralDoctorInputData = createAction(
  '[User Frontend Triggered] General Doctor input login data',
  props<{ doctorName: string; patientName: string; patientAge: number }>(),
);

export const SetDoctorProfile = createAction(
  '[User API] Doctor set doctor profile',
  props<{ name: string }>(),
);

export const SetPatientProfile = createAction(
  '[User API] Doctor set patient profile',
  props<{ name: string; age: number }>(),
);

export const RegisterDoctorType = createAction(
  '[User API] Register doctor type',
  props<{ doctorType: DoctorType }>(),
);

export const SecretKeyError = createAction('[User API] Unique key error');

export const Logout = createAction('[LOGOUT] RESET');
