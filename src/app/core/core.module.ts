import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

const routerStoreFilterPredicate = function (
	actionType: string,
	res: boolean = true,
): { actionType: string; res: boolean } {
	return {
		actionType,
		res: res && actionType.startsWith('@ngrx'),
	};
};

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forRoot({}, {}),
		StoreDevtoolsModule.instrument({
			maxAge: 25,
			logOnly: environment.production,
			name: 'Seizure Detector',
			predicate: actionType => routerStoreFilterPredicate(actionType).res,
		}),
		EffectsModule.forRoot([]),
		StoreRouterConnectingModule.forRoot(),
	],
	declarations: [],
})
export class CoreModule {}
