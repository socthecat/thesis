import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ContractsService } from 'src/app/services/contracts.resolver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'cw-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss']
})
export class MintFormComponent implements OnInit, OnDestroy {
  possibleIds: Array<string> = [
    '000001',
    '000002',
    '000003',
    '000004',
    '000005'
  ];
  form: FormGroup;
  checkMinted$: Subscription;

  constructor(
    private contractsService: ContractsService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  get tokenId(): number {
    const uri = this.form.getRawValue().uri;
    return parseInt(uri.slice(5, 6))
  }

  get metadataURI(): string {
    return `${environment.CONTENT_ID}/${this.form.getRawValue().uri}.jpg`;
  }

  ngOnInit(): void {
    this.form = this.initForm();
    this.checkMinted();
  }

  ngOnDestroy(): void {
    this.checkMinted$.unsubscribe();
  }

  async mint() {
    try {
      const result = await this.contractsService.contract.safeMint(
        this.contractsService.collegeAddress.value,
        this.metadataURI,
        this.tokenId
      );

      await result.wait();
      this.contractsService.tokenData.next({
        metadataURI: this.metadataURI,
        tokenId: this.tokenId
      });
      this.toastr.success('Diploma succesfully minted!');
      this.router.navigate(['/send']);
    } catch (error) {
      this.toastr.error(error as string);
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      uri: new FormControl(null, Validators.required)
    });
  }

  private checkMinted() {
    this.checkMinted$ = this.form.valueChanges.subscribe(async value => {
      if (this.form.get('uri')?.value) {
        this.form.setErrors({'loading': true});
        const isContentOwned = await this.contractsService.contract.isContentOwned(this.metadataURI);
        if (isContentOwned) {
          this.form.get('uri')?.setValue(null);
          this.toastr.info('This diploma was already issued. Please select another one');
        } else {
          this.form.setErrors(null);
        }
      }
    });
  }

}
