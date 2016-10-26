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
  private errorMessage = '';

  constructor(private loginService: LoginService, private pocketService: PocketService, private router: Router, private activatedRoute: ActivatedRoute) { }

  private switchToErrorMode(duringOperation: string, error: any) {
    console.log(`Error during ${duringOperation}`);
    console.log(error);
    this.errorMessage = error;
    this.errorDuringLogin = true;
  }

  ngOnInit() {

    try {
    console.log(this.activatedRoute.params);
    this.activatedRoute.params
      .map(params => params['operation'])
      .subscribe((operation) => {
        console.log(`Operation is ${operation}`);
        if (!operation || operation == 'sendToPocket') {
          this.pocketService.getRequestToken().then(token => {
            localStorage.setItem('pocketRequestToken', token);
            this.pocketService.redirectToLogin(token);
          }).catch( (error) => {
            this.switchToErrorMode("Requesting Initial Login Token", error);
          });
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
              this.router.navigate(['/pocket']);
            }
          ).catch( (error) => {
            this.switchToErrorMode("Acquiring Access Token", error);
          });
        }


      }, (error) => {
        this.switchToErrorMode("Login Error", error);
      });
    } catch (error) {
      this.switchToErrorMode("Internal Error", error);
    }


  }

}
