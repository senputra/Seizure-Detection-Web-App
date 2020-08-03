import { UserState, UserReducer } from './user.reducer';
import { RecordingState, RecordingReducer } from './recording.reducer';
import { environment } from '@environment/environment';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  // on,
} from '@ngrx/store';

export interface State {
  user: UserState;
  recording: RecordingState;
}

export const reducers: ActionReducerMap<State> = {
  user: UserReducer,
  recording: RecordingReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
