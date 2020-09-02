import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, merge, Subscription, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectPreviewVideoURL,
  selectPriority,
  selectIsUploadDone,
  selectUploadPercentage,
} from '@core/reducers/recording.reducer';
import { tap, filter, take, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { selectDoctorName, selectPatientAge, selectPatientName } from '@core/reducers/user.reducer';
import { GeneralDoctorInputData, CHANGE_PRIORITY, SUBMIT_DATA } from '@core/actions';

@Component({
  selector: 'app-record-preview',
  templateUrl: './record-preview.component.html',
  styleUrls: ['./record-preview.component.scss'],
})
export class RecordPreviewComponent implements OnDestroy {
  previewURL$: Observable<SafeUrl | undefined>;
  uploadPercentage$: Observable<number>;
  uploadDone$: Observable<boolean>;
  priority = 3;

  form: FormGroup;

  private subscriptions: Subscription[] = [];
  constructor(private store: Store, private fb: FormBuilder) {
    this.uploadDone$ = this.store.select(selectIsUploadDone);
    this.previewURL$ = this.store.select(selectPreviewVideoURL);
    this.uploadPercentage$ = this.store.select(selectUploadPercentage);

    this.form = this.fb.group({
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      patientAge: [1, [Validators.required, Validators.min(0), Validators.max(1000)]],
      priority: [3, Validators.required],
      extraNotes: [''],
    });

    this.subscriptions.push(
      zip(
        this.store.select(selectDoctorName),
        this.store.select(selectPatientName),
        this.store.select(selectPatientAge),
      ).subscribe(([doctorName, patientName, patientAge]) => {
        this.form.patchValue({
          doctorName,
          patientName,
          patientAge,
        });
      }),
    );
  }

  changePriority(i: number): void {
    this.priority = i;
    this.store.dispatch(
      CHANGE_PRIORITY({
        priority: i,
      }),
    );
  }
  submit(): void {
    this.uploadDone$
      .pipe(
        take(1),
        map(done => {
          if (done) {
            this.store.dispatch(
              SUBMIT_DATA({
                doctorName: (this.form.value.doctorName as string) || '',
                patientName: (this.form.value.patientName as string) || '',
                patientAge: (this.form.value.patientAge as number) || 1,
                priority: this.priority,
                extraNotes: (this.form.value.extraNotes as string) || '',
              }),
            );
          } else {
            alert('Upload is not done yet. Please wait!');
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs: Subscription) => {
      subs.unsubscribe();
    });
  }
}
