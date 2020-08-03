import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{
		path: 'login',
		loadChildren: () => import('@feature/login/login.module').then(m => m.LoginModule),
	},
	{
		path: 'detector',
		loadChildren: () => import('@feature/detector/detector.module').then(m => m.DetectorModule),
	},
	{
		path: 'record',
		loadChildren: () => import('@feature/record/record.module').then(m => m.RecordModule),
	},
	{
		path: 'record-dashboard',
		loadChildren: () =>
			import('@feature/record-dashboard/record-dashboard.module').then(
				m => m.RecordDashboardModule,
			),
	},
	{
		path: '**',
		loadChildren: () =>
			import('@feature/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			preloadingStrategy: PreloadAllModules,
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
