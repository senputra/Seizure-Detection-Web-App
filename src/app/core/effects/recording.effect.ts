import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, from, of, interval } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  filter,
  finalize,
  first,
  tap,
  concatMap,
  withLatestFrom,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { CloudStorageService } from '../services/cloud-storage.service';
import { RecordService } from '../services/recorder.service';
import { DatabaseService } from '../services/database.service';
import {
  INITIATE_UPLOAD,
  LOAD_RECORDER,
  UPLOAD_DONE,
  UPLOADING,
  START_RECORDING,
  STOP_RECORDING,
  SUBMIT_DATA,
  REDO,
  TIMER_ONE_SEC_ELAPSED,
} from '../actions';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { Router } from '@angular/router';
import {
  selectPreviewVideoURL,
  selectStoragePath,
  selectIsRecording,
} from '@core/reducers/recording.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecordingEffects {
  initiateUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(INITIATE_UPLOAD),
      tap(() => this.router.navigate(['record', 'preview'])),
      mergeMap(action => this.storageService.uploadRecordingData(action.blobFile, action.filename)),
      map((uploadTask: UploadTaskSnapshot | undefined) => {
        // type guard
        if (typeof uploadTask === 'undefined') {
          throw Error('upload error');
        } else {
          return uploadTask;
        }
      }),
      filter(
        (uploadTask: UploadTaskSnapshot) => uploadTask.bytesTransferred === uploadTask.totalBytes,
      ),
      map((uploadTask: UploadTaskSnapshot) => {
        console.log(uploadTask.ref.fullPath);
        return UPLOAD_DONE({ path: uploadTask.ref.fullPath });
      }),
    ),
  );

  startRecording$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(START_RECORDING),
        /** An EMPTY observable only emits completion. Replace with your own observable stream */
        tap(() => this.recordService.startRecording()),
        switchMap(action =>
          interval(100).pipe(
            take(181), // take must be inside the inner pipe to contain its effect
            // concatMap(val => of(val).pipe(withLatestFrom(this.store.select(selectIsRecording)))),
            // filter(([val, isRecording]) => isRecording),
            takeUntil(this.actions$.pipe(ofType(STOP_RECORDING))),
          ),
        ),
        map(val => {
          if (val >= 180) {
            return STOP_RECORDING();
          } else {
            return TIMER_ONE_SEC_ELAPSED();
          }
        }),
      );
    },
    // { dispatch: false },
  );

  stopRecording$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(STOP_RECORDING),
        /** An EMPTY observable only emits completion. Replace with your own observable stream */
        map(() => {
          this.recordService.stopRecording();
          // this.recordService.shutdown();
        }),
      );
    },
    { dispatch: false },
  );

  loadRecorder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LOAD_RECORDER),
        map(action => {
          this.recordService.setVideoPreviewElement(action.videoPreviewId);
          this.recordService.startVideoStream();
        }),
      ),
    { dispatch: false },
  );
  redoRecording$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(REDO),
        map(() => {
          this.router.navigate(['record']);
        }),
      ),
    { dispatch: false },
  );

  submitData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SUBMIT_DATA),
        concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectStoragePath)))),
        map(([action, mediaURLpath]) => {
          if (typeof mediaURLpath === 'undefined') {
            throw new Error('media path not found');
          } else {
            this.databaseService.submitRecording({
              mediaURL: mediaURLpath,
              priority: action.priority,
              patientName: action.patientName,
              patientAge: action.patientAge,
              doctorName: action.doctorName,
              recordingDate: new Date(),
              notes: action.extraNotes,
            });

            this.router.navigate(['record', 'sus']);
          }
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private storageService: CloudStorageService,
    private recordService: RecordService,
    private databaseService: DatabaseService,
    private router: Router,
  ) {}
}
