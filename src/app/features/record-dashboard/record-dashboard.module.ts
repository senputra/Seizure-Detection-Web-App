import { NgModule } from '@angular/core';
import { RecordDashboardComponent } from './record-dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: RecordDashboardComponent }];

export const RecordDashboardRoutes = RouterModule.forChild(routes);

@NgModule({
	imports: [RecordDashboardRoutes],
	exports: [RouterModule],
})
class RecordDashboardRoutingModule {}

@NgModule({
	imports: [SharedModule, RecordDashboardRoutingModule],
	declarations: [RecordDashboardComponent],
})
export class RecordDashboardModule {}
