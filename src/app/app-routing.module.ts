import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstallMetamaskComponent } from './components/install-metamask/install-metamask.component';
import { MintFormComponent } from './components/mint-form/mint-form.component';
import { SendFormComponent } from './components/send-form/send-form.component';
import { StartComponent } from './components/start/start.component';
import { SuccessComponent } from './components/success/success.component';
import { ContractsService } from './services/contracts.resolver';
import { MetamaskGuard } from './services/metamask.guard';
import { MintGuard } from './services/mint.guard';
import { SendGuard } from './services/send.guard';

export const routes: Routes = [
  { path: '', component: StartComponent, canActivate: [ MetamaskGuard ], resolve: { contracts: ContractsService } },
  { path: 'install-metamask', component: InstallMetamaskComponent },
  { path: 'mint', component: MintFormComponent, canActivate: [ MintGuard ] },
  { path: 'send', component: SendFormComponent, canActivate: [ SendGuard ] },
  { path: 'success', component: SuccessComponent, canActivate: [ SendGuard ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
