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
} from '@core/actions';

export const recordingStateFeatureKey = 'recording';

export interface RecordingState {
  status: RecordingStatus;
  audioVolume: number; // this number can be use to trigger animation
  videoPreviewURL?: string; // only to show before uploading
  priority: number;
  storagePath?: string;
  secondsElapsed: number;
  entities: {
    [id: string]: RecordingDoc;
  };
  ids: string[];
}

const initialState: RecordingState = {
  status: RecordingStatus.NOT_RECORDING,
  audioVolume: 0,
  priority: 3,
  secondsElapsed: 0,
  entities: {},
  ids: [],
};

const recordingReducer = createReducer(
  initialState,
  on(START_RECORDING, (state, action) => {
    return { ...state, status: RecordingStatus.RECORDING, secondsElapsed: 0 };
  }),
  on(STOP_RECORDING, (state, action) => {
    return { ...state, status: RecordingStatus.NOT_RECORDING, secondsElapsed: 0 };
  }),
  on(TIMER_ONE_SEC_ELAPSED, (state, action) => {
    return {
      ...state,
      secondsElapsed: state.secondsElapsed + 1,
    };
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
  on(ADD_FROM_FIRESTORE, (state, action) => {
    const newEntities = { ...state.entities };
    newEntities[action.data.id] = action.data;
    console.log(newEntities);
    console.log(action);

    return { ...state, entities: newEntities, ids: [...state.ids, action.data.id] };
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
