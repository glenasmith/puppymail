import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { LoggedInGuard } from './login.guard';


const routes: Routes = [
    { path: '',  redirectTo: '/subscribers',  pathMatch: 'full'},
    { path: 'subscribers', component: SubscribersComponent, canActivate: [LoggedInGuard] },
    { path: 'login', component: LoginComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoggedInGuard]
})
export class PuppemailRoutingModule { }
