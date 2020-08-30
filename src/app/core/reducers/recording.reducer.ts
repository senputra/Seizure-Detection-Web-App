import { User, ANONYMOUS_DOCTOR, RecordingStatus } from '../models';
import { createReducer, Action, on, createFeatureSelector, createSelector } from '@ngrx/store';
import {
  START_RECORDING,
  UPLOAD_DONE,
  INITIATE_UPLOAD,
  CHANGE_PRIORITY,
  STOP_RECORDING,
} from '@core/actions';

export const recordingStateFeatureKey = 'recording';

export interface RecordingState {
  status: RecordingStatus;
  audioVolume: number; // this number can be use to trigger animation
  videoPreviewURL?: string; // only to show before uploading
  priority: number;
  storagePath?: string;
}

const initialState: RecordingState = {
  status: RecordingStatus.NOT_RECORDING,
  audioVolume: 0,
  priority: 3,
};

const recordingReducer = createReducer(
  initialState,
  on(START_RECORDING, (state, action) => {
    return { ...state, status: RecordingStatus.RECORDING };
  }),
  on(STOP_RECORDING, (state, action) => {
    return { ...state, status: RecordingStatus.NOT_RECORDING };
  }),
  on(INITIATE_UPLOAD, (state, action) => {
    return { ...state, videoPreviewURL: action.videoURL };
  }),
  on(CHANGE_PRIORITY, (state, action) => {
    return { ...state, priority: action.priority };
  }),
  on(UPLOAD_DONE, (state, action) => {
    return { ...state, storagePath: action.path };
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
