import { User, ANONYMOUS_DOCTOR, RecordingStatus } from '../models';
import { createReducer, Action, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { START_RECORDING, UPLOAD_DONE, INITIATE_UPLOAD } from '@core/actions';

export const recordingStateFeatureKey = 'recording';

export interface RecordingState {
  status: RecordingStatus;
  audioVolume: number; // this number can be use to trigger animation
  videoPreviewURL?: string; // only to show before uploading
}

const initialState: RecordingState = {
  status: RecordingStatus.NOT_RECORDING,
  audioVolume: 0,
};

const recordingReducer = createReducer(
  initialState,
  on(START_RECORDING, (state, action) => {
    return { ...state, status: RecordingStatus.RECORDING };
  }),
  on(START_RECORDING, (state, action) => {
    return { ...state, status: RecordingStatus.NOT_RECORDING };
  }),
  on(INITIATE_UPLOAD, (state, action) => {
    return { ...state, videoPreviewURL: action.videoURL };
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

export const selectPreviewVideoURL = createSelector(
  selectRecordingState,
  (state: RecordingState) => state.videoPreviewURL,
);
