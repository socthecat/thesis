import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContractsService } from 'src/app/services/contracts.resolver';

@Component({
  selector: 'cw-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss']
})
export class SendFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private contractsService: ContractsService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  get metadataURI(): string {
    return this.contractsService.tokenData.value?.metadataURI || '';
  }

  ngOnInit(): void {
    this.form = this.initForm();
  }

  private initForm(): FormGroup {
    return new FormGroup({
      student: new FormControl(null, Validators.required)
    });
  }

  async send() {
    try {
      // sendToStudent(uint256 tokenId, address college, address student)
      const tokenId = this.contractsService.tokenData.value?.tokenId;
      const college = this.contractsService.collegeAddress.value;
      const student = this.form.getRawValue().student;

      const result = await this.contractsService.contract.sendToStudent(
        tokenId,
        college,
        student
      );
      await result.wait();

      this.contractsService.tokenData.next({
        ...this.contractsService.tokenData.value,
        studentAddress: this.form.getRawValue().student
      });
      this.toastr.success('Diploma succesfully sent!');
      this.router.navigate(['/success']);
    } catch(error) {
      this.toastr.error('An error occured while sending.');
    }
  }

}
