import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Logout } from '@core/actions';
import { Observable } from 'rxjs';
import { DoctorType } from '@core/models';
import { selectDoctorType, selectIsAuthenticated } from '@core/reducers/user.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  type$: Observable<DoctorType | undefined>;
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store) {
    this.type$ = this.store.select(selectDoctorType);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {}

  logout(): void {
    this.store.dispatch(Logout());
  }
}
