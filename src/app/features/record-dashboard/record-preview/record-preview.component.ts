import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, merge, Subscription, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectRecordingDoc } from '@core/reducers/recording.reducer';
import { tap, filter, take, switchMap, startWith, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Validators, FormBuilder } from '@angular/forms';
import { selectDoctorName, selectPatientAge, selectPatientName } from '@core/reducers/user.reducer';
import {
  GeneralDoctorInputData,
  CHANGE_PRIORITY,
  SUBMIT_DATA,
  USER_DELETE_DOC,
} from '@core/actions';
import { ActivatedRoute, Params } from '@angular/router';
import { RecordingDoc } from '@core/models';
import { CloudStorageService } from '@core/services/cloud-storage.service';

@Component({
  selector: 'app-record-preview',
  templateUrl: './record-preview.component.html',
  styleUrls: ['./record-preview.component.scss'],
})
export class RecordPreviewComponent implements OnDestroy {
  previewURL$: Observable<string>;
  // docName$: Observable<string | undefined>;
  // priority$: Observable<number>;

  recordingDoc$: Observable<RecordingDoc>;
  private docId = '';
  private subscriptions: Subscription[] = [];
  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private cloud: CloudStorageService,
  ) {
    const video = document.getElementById('preview') as HTMLVideoElement;
    this.docId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.recordingDoc$ = this.store.select(selectRecordingDoc, { id: this.docId });
    this.previewURL$ = this.recordingDoc$.pipe(
      switchMap((doc: RecordingDoc) => this.cloud.getDownloadURL(doc.mediaURL)),
      map(url => url),
      take(1),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs: Subscription) => {
      subs.unsubscribe();
    });
  }

  deleteDoc(): void {
    this.recordingDoc$
      .pipe(take(1))
      .subscribe(doc =>
        this.store.dispatch(USER_DELETE_DOC({ id: this.docId, mediaPath: doc.mediaURL })),
      );
  }
}
