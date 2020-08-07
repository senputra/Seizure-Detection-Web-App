import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers } from './reducers/index';
import { UserEffects } from './reducers/user.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: 'Seizure Detector',
      predicate: (state, action) => {
        return !action.type.startsWith('@ngrx');
      },
    }),
    EffectsModule.forRoot([UserEffects]),
    StoreRouterConnectingModule.forRoot(),
  ],
  declarations: [],
})
export class CoreModule {}
