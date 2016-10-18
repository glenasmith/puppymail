import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
// import { LoggedInGuard } from './login.guard';


const routes: Routes = [
    { path: '',  redirectTo: '/login/sendToPocket',  pathMatch: 'full'},
   // { path: 'subscribers', component: SubscribersComponent, canActivate: [LoggedInGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'login/:operation', component: LoginComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  //providers: [LoggedInGuard]
})
export class PuppyMailRoutingModule { }
