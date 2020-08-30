import { NgModule } from '@angular/core';
import { RecordComponent } from './record.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { RecordPreviewComponent } from './record-preview/record-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuccessfulSubmissionComponent } from './successful-submission/successful-submission.component';

const routes: Routes = [
  { path: '', component: RecordComponent },
  { path: 'preview', component: RecordPreviewComponent },
  { path: 'sus', component: SuccessfulSubmissionComponent },
];

export const RecordRoutes = RouterModule.forChild(routes);

@NgModule({
  imports: [RecordRoutes],
  exports: [RouterModule],
})
class RecordRoutingModule {}

@NgModule({
  imports: [SharedModule, RecordRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [RecordComponent, RecordPreviewComponent, SuccessfulSubmissionComponent],
})
export class RecordModule {}
