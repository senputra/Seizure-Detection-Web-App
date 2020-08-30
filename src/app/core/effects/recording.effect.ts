import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, from, of } from 'rxjs';
import { map, mergeMap, catchError, filter, finalize, first, tap } from 'rxjs/operators';
import { CloudStorageService } from '../services/cloud-storage.service';
import { RecordService } from '../services/recorder.service';
import {
  INITIATE_UPLOAD,
  LOAD_RECORDER,
  UPLOAD_DONE,
  UPLOADING,
  START_RECORDING,
  STOP_RECORDING,
} from '../actions';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { Router } from '@angular/router';

@Injectable()
export class RecordingEffects {
  initiateUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(INITIATE_UPLOAD),
      tap(() => this.router.navigate(['record', 'preview'])),
      mergeMap(action => this.storageService.uploadRecordingData(action.blobFile, action.filename)),
      map((uploadTask: UploadTaskSnapshot | undefined) => {
        if (typeof uploadTask === 'undefined') {
          throw Error('upload task undefined');
        } else {
          if (uploadTask.bytesTransferred === uploadTask.totalBytes) {
            console.log(uploadTask.ref.fullPath);
            return UPLOAD_DONE({ path: uploadTask.ref.fullPath });
          }
        }
        return UPLOADING({
          percentage: uploadTask.bytesTransferred / uploadTask.totalBytes,
        });
      }),
    ),
  );

  startRecording$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(START_RECORDING),
        /** An EMPTY observable only emits completion. Replace with your own observable stream */
        map(() => this.recordService.startRecording()),
      );
    },
    { dispatch: false },
  );

  stopRecording$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(STOP_RECORDING),
        /** An EMPTY observable only emits completion. Replace with your own observable stream */
        map(() => this.recordService.stopRecording()),
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

  constructor(
    private actions$: Actions,
    private storageService: CloudStorageService,
    private recordService: RecordService,
    private router: Router,
  ) {}
}
