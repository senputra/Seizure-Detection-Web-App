import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GeneralDoctorInputData } from '@core/actions';

@Component({
  selector: 'app-patient-doctor-register-page',
  templateUrl: './patient-doctor-register-page.component.html',
  styleUrls: ['./patient-doctor-register-page.component.css'],
})
export class PatientDoctorRegisterPageComponent implements OnInit {
  form = this.fb.group({
    patientName: ['', Validators.required],
    doctorName: ['', Validators.required],
    patientAge: [1, [Validators.min(0), Validators.max(100)]],
  });

  constructor(private store: Store, private fb: FormBuilder) {}

  submitSecretKey(): void {
    this.store.dispatch(
      GeneralDoctorInputData({
        doctorName: (this.form.value.doctorName as string) || '',
        patientName: (this.form.value.patientName as string) || '',
        patientAge: (this.form.value.patientAge as number) || 1,
      }),
    );
  }

  ngOnInit() {}
}
