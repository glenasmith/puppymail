
import { PocketService } from './pocket.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class PocketGuard implements CanActivate {
    constructor(private pocketService: PocketService, private router: Router) { }

    canActivate(): boolean {

        console.log("Guard function has been invoked");

        let authenticated = false;

        if (this.pocketService.accessToken) {
            authenticated = true;
        }
        else {
            this.router.navigate(['/login']);
        }
        console.log("Returning from Guard function with: " + authenticated);
        return authenticated;
    }
}