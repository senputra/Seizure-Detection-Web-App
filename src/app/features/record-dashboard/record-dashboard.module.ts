import { NgModule } from '@angular/core';
import { RecordDashboardComponent } from './record-dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { RecordPreviewComponent } from '@feature/record-dashboard/record-preview/record-preview.component';
import {
  AdminConsoleComponent,
  NewKeyDialogComponent,
} from './admin-console/admin-console.component';

const routes: Routes = [
  { path: '', component: RecordDashboardComponent },
  { path: 'admin-console', component: AdminConsoleComponent },
  {
    path: 'd/:id',
    component: RecordPreviewComponent,
  },
];

export const RecordDashboardRoutes = RouterModule.forChild(routes);

@NgModule({
  imports: [RecordDashboardRoutes],
  exports: [RouterModule],
})
class RecordDashboardRoutingModule {}

@NgModule({
  imports: [SharedModule, RecordDashboardRoutingModule],
  declarations: [
    RecordDashboardComponent,
    RecordPreviewComponent,
    AdminConsoleComponent,
    NewKeyDialogComponent,
  ],
  entryComponents: [NewKeyDialogComponent],
})
export class RecordDashboardModule {}
