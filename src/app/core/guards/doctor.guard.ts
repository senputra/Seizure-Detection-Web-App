import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { DoctorType } from '@core/models';
import { selectDoctorType } from '@core/reducers/user.reducer';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DoctorGuard implements CanActivate {
  constructor(private store: Store) {}

  private readonly generalDoctorURL = ['/record', '/detector'];
  private readonly specialistDoctorURL = ['/record-dashboard'];

  /**
   * Check if the specialist and doctor are in their respective pages
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    return this.store.select(selectDoctorType).pipe(
      map(doctorType => {
        console.log(doctorType);
        switch (doctorType) {
          case DoctorType.GENERAL:
            return this.generalDoctorURL.indexOf(url) !== -1;
          case DoctorType.SPECIALIST:
            return this.specialistDoctorURL.indexOf(url) !== -1;
          default:
            return false;
        }
      }),
    );
  }
}
