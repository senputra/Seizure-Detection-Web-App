import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: LoginComponent }];

export const LoginRoutes = RouterModule.forChild(routes);

@NgModule({
	imports: [LoginRoutes],
	exports: [RouterModule],
})
class LoginRoutingModule {}

@NgModule({
	imports: [SharedModule, LoginRoutingModule],
	declarations: [LoginComponent],
})
export class LoginModule {}
