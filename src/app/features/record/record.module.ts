import { NgModule } from '@angular/core';
import { RecordComponent } from './record.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: RecordComponent }];

export const RecordRoutes = RouterModule.forChild(routes);

@NgModule({
	imports: [RecordRoutes],
	exports: [RouterModule],
})
class RecordRoutingModule {}

@NgModule({
	imports: [SharedModule, RecordRoutingModule],
	declarations: [RecordComponent],
})
export class RecordModule {}
