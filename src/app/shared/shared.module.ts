import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
const modules = [CommonModule, MaterialModule, FormsModule];
@NgModule({
  imports: modules,
  declarations: [],
  exports: modules,
})
export class SharedModule {}
