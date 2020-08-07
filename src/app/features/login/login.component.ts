import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated } from '@core/reducers/user.reducer';
import { LoginWithSecretKey } from '@core/actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  secretKeyForm = this.fb.group({
    secretKeyFormControl: ['', Validators.required],
  });

  constructor(private store: Store, private fb: FormBuilder) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  submitsecretKey(): void {
    this.store.dispatch(
      LoginWithSecretKey({
        secretKey: this.secretKeyForm.value['secretKeyFormControl'],
      }),
    );
  }

  ngOnInit() {}
}
