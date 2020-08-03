import { User, ANONYMOUS_USER, RecordingStatus } from '../models';
import { createReducer, Action } from '@ngrx/store';

export const recordingStateFeatureKey = 'recordingState';

export interface RecordingState {
  status: RecordingStatus;
  audioVolume: number; // this number can be use to trigger animation
}

const initialState: RecordingState = {
  status: RecordingStatus.NOT_RECORDING,
  audioVolume: 0,
};

const recordingReducer = createReducer(initialState);

export function RecordingReducer(
  state: RecordingState | undefined,
  action: Action,
): RecordingState {
  return recordingReducer(state, action);
}
