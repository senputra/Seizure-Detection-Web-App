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
import { map, mergeMap, tap, switchMap, take } from 'rxjs/operators';
import { environment } from '@environment/environment';
import { Router } from '@angular/router';
import { DatabaseService } from '@core/services/database.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  type: DoctorType.NON,
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
        switchMap(action => this.db.getDoctorTypeFromKey(action.secretKey).pipe(take(1))),
        map(action => {
          console.log(action);
          switch (action) {
            case DoctorType.SPECIALIST:
              this.router.navigate(['/dashboard']);
              return RegisterDoctorType({ doctorType: DoctorType.SPECIALIST });
            case DoctorType.GENERAL:
              this.router.navigate(['/login', 'check-in']);
              return RegisterDoctorType({ doctorType: DoctorType.GENERAL });
            default:
              this.snackBar.open('Key is wrong', undefined, {
                duration: 1000,
              });
              return SecretKeyError();
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

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private db: DatabaseService,
    private snackBar: MatSnackBar,
  ) {
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
