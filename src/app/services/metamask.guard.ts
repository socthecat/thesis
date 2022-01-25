declare const window: any;
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MetamaskGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (window.ethereum) {
      return true;
    } else {
      return this.router.parseUrl('/install-metamask');
    }
  }
  
}
