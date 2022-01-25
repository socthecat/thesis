declare const window: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContractsService } from 'src/app/services/contracts.resolver';

@Component({
  selector: 'cw-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(
    private contractsService: ContractsService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async connectWallet() {
    try {
      const accounts: Array<string> = await window.ethereum.request({ method: "eth_requestAccounts" });
      this.contractsService.collegeAddress.next(accounts[0]);
      this.toastr.success('Account connected!', 'Success!');
      this.router.navigate(['/mint']);
    } catch(error) {
      this.toastr.error(error as string, 'Error!');
    }
  }

}
