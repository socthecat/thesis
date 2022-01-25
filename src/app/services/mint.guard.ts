import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ContractsService } from './contracts.resolver';

@Injectable({
  providedIn: 'root'
})
export class MintGuard implements CanActivate {

  constructor(
    private contractsService: ContractsService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.contractsService.collegeAddress.value) {
      return true;
    } else {
      return this.router.parseUrl('/');
    }
  }
  
}
