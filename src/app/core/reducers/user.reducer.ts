import { User, ANONYMOUS_USER } from '../models';
import { createReducer, Action } from '@ngrx/store';

export const userStateFeatureKey = 'userState';

export interface UserState extends User {
  name: string;
}

const initialState: UserState = ANONYMOUS_USER;

const userReducer = createReducer(initialState);

export function UserReducer(state: UserState | undefined, action: Action): UserState {
  return userReducer(state, action);
}
