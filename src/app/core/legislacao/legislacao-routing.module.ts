import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../seguranca/auth.guard';
import { LegislacaoConsultaComponent } from './legislacao-consulta/legislacao-consulta.component';
import { LegislacaoCadEditComponent } from './legislacao-cad-edit/legislacao-cad-edit.component';


const routes: Routes = [
  { path: '', component:LegislacaoConsultaComponent, canActivate: [AuthGuard]},
  { path: 'nova', component:LegislacaoCadEditComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] }},
  { path: ':id', component:LegislacaoCadEditComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegislacaoRoutingModule { }
