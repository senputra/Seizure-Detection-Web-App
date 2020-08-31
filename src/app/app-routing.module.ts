import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard, DoctorGuard } from '@core/guards';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('@feature/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'record',
    loadChildren: () => import('@feature/record/record.module').then(m => m.RecordModule),
    canActivate: [AuthGuard, DoctorGuard],
  },
  {
    path: 'record-dashboard',
    loadChildren: () =>
      import('@feature/record-dashboard/record-dashboard.module').then(
        m => m.RecordDashboardModule,
      ),
    canActivate: [AuthGuard, DoctorGuard],
  },
  {
    path: '**',
    loadChildren: () =>
      import('@feature/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
    canActivate: [AuthGuard],
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
