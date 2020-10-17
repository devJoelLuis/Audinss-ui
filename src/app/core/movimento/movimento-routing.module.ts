import { FolhaCorrecaoCadEditComponent } from './folha-correcao-cad-edit/folha-correcao-cad-edit.component';
import { FolhaCorrecaoComponent } from './folha-correcao/folha-correcao.component';
import {FolhaPagamentoCadEditComponent } from './folha-pagamento-cad-edit/folha-pagamento-cad-edit.component';
import { AuthGuard } from './../seguranca/auth.guard';
import { FolhaPagamentoComponent } from './folha-pagamento/folha-pagamento.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '', component: FolhaPagamentoComponent, canActivate: [AuthGuard]},
  {path: 'fp', component: FolhaPagamentoCadEditComponent, canActivate: [AuthGuard]},
  {path: 'fc', component: FolhaCorrecaoComponent, canActivate: [AuthGuard]},
  {path: 'fc/relatorio', component: FolhaCorrecaoComponent, canActivate: [AuthGuard]},
  {path: 'fc/edit', component: FolhaCorrecaoCadEditComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimentoRoutingModule { }
