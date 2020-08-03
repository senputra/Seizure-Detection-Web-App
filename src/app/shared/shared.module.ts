import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
const modules = [CommonModule, MaterialModule];
@NgModule({
	imports: modules,
	declarations: [],
	exports: modules,
})
export class SharedModule {}
