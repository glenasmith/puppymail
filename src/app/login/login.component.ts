import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { PocketService } from '../pocket.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private errorDuringLogin = false;

  constructor(private loginService: LoginService, private pocketService : PocketService, private router: Router, private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    console.log(this.activatedRoute.params);
    this.activatedRoute.params
      .map(params => params['operation'])
      .subscribe((operation) => {
        console.log(`Operation is ${operation}`);  
        if (!operation || operation == 'sendToPocket') { 
            this.pocketService.getRequestToken().then( token => {
              localStorage.setItem('pocketRequestToken', token);
              this.pocketService.redirectToLogin(token);
            })
        } else if (operation == 'backFromPocket') {
            let code = this.pocketService.code
            if (code) {
              console.log(`Wow. Code in memory is ${code}`);
            } else {
              code = localStorage.getItem('pocketRequestToken');
              console.log(`Localstorage code is ${code}`);
            }
            this.pocketService.getUserAccessToken(code).then(
              (accessToken) => {
                console.log(`Username is: ${this.pocketService.userName}`);
              }
            )
        } 

        
      });

    // console.log("Starting Login Page. Authenticated is: " + this.loginService.isAuthenticated);
    // if (this.loginService.isAuthenticated) {
    //   this.router.navigate(['/home']);
    // } else {
    //   this.loginService.login().then((authState) => {
    //     if (authState && authState.uid) {
    //       console.log("Login successful for " + authState.auth.displayName);
    //       this.router.navigate(['/quotes']);
    //     } else {
    //       this.errorDuringLogin = true;
    //     }
    //   })
    // };
  }

}
