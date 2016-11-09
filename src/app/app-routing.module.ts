import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PocketlinksComponent } from './pocketlinks/pocketlinks.component';
import { PocketGuard } from './pocket.guard';
import { NewsletterComponent } from './newsletter/newsletter.component';
// import { LoggedInGuard } from './login.guard';


const routes: Routes = [
    { path: '',  redirectTo: '/pocket',  pathMatch: 'full'},
   // { path: 'subscribers', component: SubscribersComponent, canActivate: [LoggedInGuard] },
    //{ path: 'pocket', component: PocketlinksComponent, canActivate: [PocketGuard] },
    { path: 'pocket', component: NewsletterComponent, canActivate: [PocketGuard],
      // children: [
      //   {
      //     path: 'select',
      //     component: NewsletterSelectComponent
      //   },
      //   {
      //     path: 'organise',
      //     component: NewsletterOrganiseComponent
      //   },
      //   {
      //     path: 'render',
      //     component: NewsletterRenderComponent
      //   }
      // ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'login/:operation', component: LoginComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [PocketGuard]
})
export class PuppyMailRoutingModule { }
