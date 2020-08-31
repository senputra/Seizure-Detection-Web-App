import { NgModule } from '@angular/core';
import { RecordDashboardComponent } from './record-dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { RecordPreviewComponent } from '@feature/record-dashboard/record-preview/record-preview.component';

const routes: Routes = [
  { path: '', component: RecordDashboardComponent },
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
  declarations: [RecordDashboardComponent, RecordPreviewComponent],
})
export class RecordDashboardModule {}
