import { NgModule } from '@angular/core';
import { DetectorComponent } from './detector.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: DetectorComponent }];

export const DetectorRoutes = RouterModule.forChild(routes);

@NgModule({
	imports: [DetectorRoutes],
	exports: [RouterModule],
})
class DetectorRoutingModule {}

@NgModule({
	imports: [SharedModule, DetectorRoutingModule],
	declarations: [DetectorComponent],
})
export class DetectorModule {}
