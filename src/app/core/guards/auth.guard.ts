import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../reducers/user.reducer';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated).pipe(
      map((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
        return isAuthenticated;
      }),
    );
    // return this.store.checkStoreAuthentication().pipe(
    //   mergeMap(async storeAuth => {
    //     if (storeAuth) {
    //       return of(true);
    //     }
    //     return await this.authService.checkApiAuthentication();
    //   }),
    //   map(storeOrApiAuth => {
    //     if (storeOrApiAuth) {
    //       return true;
    //     } else {
    //       this.router.navigate(['/login']);
    //       return false;
    //     }
    //   }),
    // );
  }
}
