import { User, ANONYMOUS_DOCTOR, RecordingStatus, RecordingDoc } from '../models';
import { createReducer, Action, on, createFeatureSelector, createSelector } from '@ngrx/store';
import {
  START_RECORDING,
  UPLOAD_DONE,
  INITIATE_UPLOAD,
  CHANGE_PRIORITY,
  STOP_RECORDING,
  TIMER_ONE_SEC_ELAPSED,
  ADD_FROM_FIRESTORE,
  DELETE_FROM_FIRESTORE,
  UPLOADING,
} from '@core/actions';
import { create } from 'domain';
import { SafeUrl } from '@angular/platform-browser';

export const recordingStateFeatureKey = 'recording';

export interface RecordingState {
  status: RecordingStatus;
  audioVolume: number; // this number can be use to trigger animation
  videoPreviewURL?: SafeUrl; // only to show before uploading
  priority: number;
  storagePath?: string;
  secondsElapsed: number;
  entities: {
    [id: string]: RecordingDoc;
  };
  ids: string[];
  uploadDone: boolean;
  percentage: number;
}

const initialState: RecordingState = {
  status: RecordingStatus.NOT_RECORDING,
  audioVolume: 0,
  priority: 3,
  secondsElapsed: 0,
  entities: {},
  ids: [],
  uploadDone: false,
  percentage: 0,
};

const recordingReducer = createReducer(
  initialState,
  on(START_RECORDING, (state, action) => {
    return { ...state, status: RecordingStatus.RECORDING, secondsElapsed: 0 };
  }),
  on(STOP_RECORDING, (state, action) => {
    return {
      ...state,
      status: RecordingStatus.NOT_RECORDING,
      secondsElapsed: 0,
    };
  }),
  on(TIMER_ONE_SEC_ELAPSED, (state, action) => {
    return {
      ...state,
      secondsElapsed: state.secondsElapsed + 1,
    };
  }),
  on(INITIATE_UPLOAD, (state, action) => {
    return { ...state, uploadDone: false, videoPreviewURL: action.videoURL, percentage: 0 };
  }),
  on(CHANGE_PRIORITY, (state, action) => {
    return { ...state, priority: action.priority };
  }),
  on(UPLOAD_DONE, (state, action) => {
    return { ...state, uploadDone: true, storagePath: action.path, percentage: 0 };
  }),
  on(UPLOADING, (state, action) => {
    return { ...state, percentage: action.percentage };
  }),
  on(ADD_FROM_FIRESTORE, (state, action) => {
    const newEntities = { ...state.entities };
    if (state.ids.indexOf(action.data.id) === -1) {
      newEntities[action.data.id] = action.data;
      return { ...state, entities: newEntities, ids: [...state.ids, action.data.id] };
    } else {
      return state;
    }
  }),
  on(DELETE_FROM_FIRESTORE, (state, action) => {
    const newEntities = { ...state.entities };
    delete newEntities[action.id];
    return { ...state, entities: newEntities, ids: state.ids.filter(id => id !== action.id) };
  }),
);

export function RecordingReducer(
  state: RecordingState | undefined,
  action: Action,
): RecordingState {
  return recordingReducer(state, action);
}

/**
 * Selectors
 */

export const selectRecordingState = createFeatureSelector<RecordingState>(recordingStateFeatureKey);

export const selectIsRecording = createSelector(
  selectRecordingState,
  (state: RecordingState) => state.status === RecordingStatus.RECORDING,
);

export const selectPreviewVideoURL = createSelector(
  selectRecordingState,
  (state: RecordingState) => state.videoPreviewURL,
);
export const selectPriority = createSelector(
  selectRecordingState,
  (state: RecordingState) => state.priority,
);
export const selectStoragePath = createSelector(
  selectRecordingState,
  (state: RecordingState) => state.storagePath,
);

export const selectSecsLeft = createSelector(selectRecordingState, (state: RecordingState) => {
  if (state.status === RecordingStatus.RECORDING) {
    return (60 - (state.secondsElapsed % 60)) % 60;
  } else {
    return 0;
  }
});
export const selectMinLeft = createSelector(selectRecordingState, (state: RecordingState) => {
  if (state.status === RecordingStatus.RECORDING) {
    return 3 - Math.ceil(state.secondsElapsed / 60);
  } else {
    return 0;
  }
});

export const selectAllEntities = createSelector(selectRecordingState, (state: RecordingState) =>
  state.ids.map(id => state.entities[id]),
);

export const selectIsUploadDone = createSelector(
  selectRecordingState,
  (state: RecordingState) => state.uploadDone,
);

export const selectUploadPercentage = createSelector(
  selectRecordingState,
  (state: RecordingState) => state.percentage,
);

// specific recording

export const selectRecordingDoc = createSelector(
  selectRecordingState,
  (state: RecordingState, props: { id: string }) => state.entities[props.id],
);

// Clean up purposes
export const selectAllStoragePath = createSelector(selectAllEntities, (docs: RecordingDoc[]) =>
  docs.map(doc => doc.mediaURL),
);
