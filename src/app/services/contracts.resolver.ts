declare const window: any;
import { Injectable } from '@angular/core';
import { Resolve} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ethers } from 'ethers';
import Diploma from '../../artifacts/contracts/Diploma.sol/Diploma.json';
import { environment } from 'src/environments/environment';

interface TokenData {
  metadataURI?: string;
  tokenId?: number;
  studentAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContractsService implements Resolve<boolean> {
  collegeAddress = new BehaviorSubject<string | null>(null);
  tokenData = new BehaviorSubject<TokenData | null>(null);
  provider: ethers.providers.Web3Provider;
  contract: ethers.Contract;

  async resolve(): Promise<any> {
    this.provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = this.provider.getSigner();
    this.contract = new ethers.Contract(environment.CONTRACT_ADDRESS, Diploma.abi, signer);
    return this.provider;
  }
}
