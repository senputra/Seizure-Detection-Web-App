import { createAction, props } from '@ngrx/store';
import { RecordingDoc } from '@core/models';

export const UPLOAD_DONE = createAction(
  '[upload recoridng] upload recording successfull',
  props<{ path: string }>(),
);
export const UPLOADING = createAction(
  '[upload recoridng] file is uploading',
  props<{ percentage: number }>(),
);
export const UPLOAD_FAIL = createAction('[upload recoridng] upload recording failed');

export const INITIATE_UPLOAD = createAction(
  '[upload recording] initiate uploade recording',
  props<{ blobFile: Blob; videoURL: string; filename: string | undefined }>(),
);

export const STOP_RECORDING = createAction('[recorder] stop recording');
export const START_RECORDING = createAction('[recorder] start recording');

export const SUBMIT_PATIENT_DATA = createAction(
  '[general doctor] doctor submit patient data with url',
);

export const LOAD_RECORDER = createAction(
  '[recorder] load recorder',
  props<{ videoPreviewId: string }>(),
);

export const CHANGE_PRIORITY = createAction(
  '[recorder] Change priority',
  props<{ priority: number }>(),
);

export const SUBMIT_DATA = createAction(
  '[doctor submit data] doctor submit data',
  props<{
    patientName: string;
    doctorName: string;
    patientAge: number;
    priority: number;
    extraNotes: string;
  }>(),
);

export const REDO = createAction('[doctor] redo recording');

export const TIMER_ONE_SEC_ELAPSED = createAction('[recorder] time elapsed');

export const LOAD_ALL = createAction('[load from firestore] load all recording from firestore');
export const ADD_FROM_FIRESTORE = createAction(
  '[load from firestore] add one recording from firestore',
  props<{ data: RecordingDoc }>(),
);
export const DELETE_FROM_FIRESTORE = createAction(
  '[load from firestore] delete one recording from firestore',
  props<{ id: string }>(),
);
