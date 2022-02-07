import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContractsService } from 'src/app/services/contracts.resolver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'cw-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnDestroy, OnInit {
  tokenURI$: Promise<string>;

  constructor(
    private contractsService: ContractsService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.tokenURI$ = this.getTokenURI();
  }

  get collegeAddress(): string {
    return this.contractsService.collegeAddress.value || '';
  }

  get studentAddress(): string {
    return this.contractsService.tokenData.value?.studentAddress || '';
  }

  get tokenId(): number {
    return this.contractsService.tokenData.value?.tokenId as number;
  }

  get contractAddress(): string {
    return environment.CONTRACT_ADDRESS;
  }

  ngOnDestroy(): void {
    this.contractsService.tokenData.next(null);
  }

  backToMint() {
    this.router.navigate(['/mint']);
  }

  async getTokenURI(): Promise<string> {
    try {
      const uri = await this.contractsService.contract.tokenURI(
        this.contractsService.tokenData.value?.tokenId
      );

      return uri;
    } catch (error) {
      this.toastr.error('An error occured while fetching the token URI.');

      return "Couldn't fetch the token URI :(";
    }
  }

}
