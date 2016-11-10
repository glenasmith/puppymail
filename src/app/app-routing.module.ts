import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PocketGuard } from './pocket.guard';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { AboutComponent } from "./about/about.component";


const routes: Routes = [
    { path: '',  redirectTo: '/dashboard',  pathMatch: 'full'},
    { path: 'dashboard', component: NewsletterComponent, canActivate: [PocketGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'login/:operation', component: LoginComponent },
    { path: 'about', component: AboutComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [PocketGuard]
})
export class PuppyMailRoutingModule { }
