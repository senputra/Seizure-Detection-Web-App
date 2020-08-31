import { DoctorType, Patient } from '../models';
import {
  createReducer,
  Action,
  on,
  Store,
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Logger } from '../devServices/logger.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  LoginWithSecretKey,
  RegisterDoctorType,
  SecretKeyError,
  SetDoctorProfile,
  SetPatientProfile,
  GeneralDoctorInputData,
  Logout,
} from '../actions';
import { map, mergeMap, tap } from 'rxjs/operators';
import { environment } from '@environment/environment';
import { Router } from '@angular/router';
/**
 * State stuff
 */
export interface UserState {
  loading: boolean;
  name?: string;
  patient?: Patient;
  type?: DoctorType;
}
export const userStateFeatureKey = 'user';

const FAKE_DOCTOR_GENERAL = {
  loading: false,
  type: DoctorType.GENERAL,
  // name: 'sadf',
  // patient: {
  //   name: 'asdf',
  //   age: 1,
  // },
};

const initialState = { loading: false };

/**
 * Reducer stuff
 */
const userReducer = createReducer(
  initialState,
  on(SecretKeyError, (state, action) => {
    return { ...state, loading: false };
  }),
  on(LoginWithSecretKey, (state, action) => {
    return { ...state, loading: true };
  }),
  on(RegisterDoctorType, (state, action) => {
    return { ...state, loading: false, type: action.doctorType };
  }),
  on(SetDoctorProfile, (state, action) => {
    return { ...state, name: action.name };
  }),
  on(SetPatientProfile, (state, action) => {
    return {
      ...state,
      patient: {
        name: action.name,
        age: action.age,
      },
    };
  }),
  on(Logout, (state, action) => {
    return initialState;
  }),
);

export function UserReducer(state: UserState | undefined, action: Action): UserState {
  return userReducer(state, action);
}

/**
 * Effect
 */
@Injectable()
export class UserEffects {
  /**
   * User attempt to login with secretKey
   */
  loginWithSecretKeyEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginWithSecretKey),
        map(action => {
          switch (action.secretKey) {
            case environment.keys.SPECIALIST_KEY:
              this.router.navigate(['/record-dashboard']);
              return RegisterDoctorType({ doctorType: DoctorType.SPECIALIST });
            case environment.keys.GENERAL_KEY:
              this.router.navigate(['/login', 'check-in']);
              return RegisterDoctorType({ doctorType: DoctorType.GENERAL });
            default:
              return SecretKeyError();
            // error notification
          }
        }),
      ),
    { dispatch: true },
  );

  /**
   * Fill up patient data and doctor data
   */
  inputLoginData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GeneralDoctorInputData),
        map(action => {
          return [
            SetDoctorProfile({
              name: action.doctorName,
            }),
            SetPatientProfile({
              name: action.patientName,
              age: action.patientAge,
            }),
          ];
        }),
        tap(() => this.router.navigate(['record'])),
        mergeMap(array => array),
      ),
    { dispatch: true },
  );

  /**
   * User Logout reset everything to inital state
   */
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(Logout),
        map(() => {
          this.router.navigate(['login']);
        }),
      ),
    { dispatch: false },
  );
  private logger: Logger;

  constructor(private actions$: Actions, private store: Store, private router: Router) {
    this.logger = new Logger('[User Effect] =>');
  }
}

/**
 * Selectors
 */

export const selectUserState = createFeatureSelector<UserState>(userStateFeatureKey);

export const selectDoctorName = createSelector(selectUserState, (state: UserState) => state.name);
export const selectDoctorType = createSelector(selectUserState, (state: UserState) => state.type);
export const selectLoading = createSelector(selectUserState, (state: UserState) => state.loading);
export const selectPatient = createSelector(selectUserState, (state: UserState) => state.patient);

export const selectPatientName = createSelector(selectPatient, patient => patient?.name);
export const selectPatientAge = createSelector(selectPatient, patient => patient?.age);
export const selectIsAuthenticated = createSelector(selectDoctorType, type => !!type);
