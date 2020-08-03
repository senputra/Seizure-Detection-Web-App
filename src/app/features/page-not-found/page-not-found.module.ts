import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: PageNotFoundComponent }];

export const PageNotFoundRoutes = RouterModule.forChild(routes);

@NgModule({
	imports: [PageNotFoundRoutes],
	exports: [RouterModule],
})
class PageNotFoundRoutingModule {}

@NgModule({
	imports: [SharedModule, PageNotFoundRoutingModule],
	declarations: [PageNotFoundComponent],
})
export class PageNotFoundModule {}
