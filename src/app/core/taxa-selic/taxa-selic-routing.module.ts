import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxaSelicConsultaComponent } from './taxa-selic-consulta/taxa-selic-consulta.component';
import { AuthGuard } from '../seguranca/auth.guard';


const routes: Routes = [
  {path: '', component:TaxaSelicConsultaComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxaSelicRoutingModule { }
