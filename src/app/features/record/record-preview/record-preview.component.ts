import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, merge, Subscription, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectPreviewVideoURL,
  selectPriority,
  selectIsUploadDone,
} from '@core/reducers/recording.reducer';
import { tap, filter, take, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Validators, FormBuilder } from '@angular/forms';
import { selectDoctorName, selectPatientAge, selectPatientName } from '@core/reducers/user.reducer';
import { GeneralDoctorInputData, CHANGE_PRIORITY, SUBMIT_DATA } from '@core/actions';

@Component({
  selector: 'app-record-preview',
  templateUrl: './record-preview.component.html',
  styleUrls: ['./record-preview.component.scss'],
})
export class RecordPreviewComponent implements OnDestroy {
  previewURL$: Observable<SafeUrl | undefined>;
  docName$: Observable<string | undefined>;
  priority$: Observable<number>;
  uploadDone$: Observable<boolean>;
  priority = 3;

  form = this.fb.group({
    patientName: ['', Validators.required],
    doctorName: ['', Validators.required],
    patientAge: [1, [Validators.min(0), Validators.max(100)]],
    priority: [3, Validators.required],
    extraNotes: [''],
  });

  private subscriptions: Subscription[] = [];
  constructor(private store: Store, private fb: FormBuilder) {
    const video = document.getElementById('preview') as HTMLVideoElement;
    this.uploadDone$ = this.store.select(selectIsUploadDone);
    this.previewURL$ = this.store.select(selectPreviewVideoURL).pipe(
      filter(url => !!url),
      take(1),
    );
    this.docName$ = this.store.select(selectDoctorName).pipe(filter(url => !!url));
    this.priority$ = this.store.select(selectPriority);

    this.subscriptions.push(
      zip(
        this.store.select(selectDoctorName),
        this.store.select(selectPatientName),
        this.store.select(selectPatientAge),
      ).subscribe(([doctorName, patientName, patientAge]) => {
        this.form.setValue({
          doctorName,
          patientName,
          patientAge,
          priority: this.form.value.priority as number,
          extraNotes: this.form.value.extraNotes as string,
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
