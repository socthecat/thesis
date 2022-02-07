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
  loading: boolean;
  formValue: string | null;

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
    return `${environment.METADATA_CONTENT_ID}/${this.form.getRawValue().uri}.json`;
  }

  get imageContentId(): string {
    return environment.IMAGE_CONTENT_ID;
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
      this.loading = true;
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
      this.loading = false;
      this.router.navigate(['/send']);
    } catch (error) {
      this.toastr.error('An error occured while minting');
      this.loading = false;
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
        this.loading = true;
        const isContentOwned = await this.contractsService.contract.isContentOwned(this.metadataURI);
        this.loading = false;
        if (isContentOwned) {
          this.form.get('uri')?.setValue(null);
          this.toastr.info('This diploma was already issued. Please select another one');
          this.form.setErrors({'owned': true});
          this.formValue = null;
        } else {
          this.form.setErrors(null);
          this.formValue = value.uri;
        }
      }
    });
  }

}
