import { ClienteCadEditComponent } from './cliente-cad-edit/cliente-cad-edit.component';
import { ClienteConsultaComponent } from './cliente-consulta/cliente-consulta.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';


const routes: Routes = [
  {
    path: '', component: ClienteConsultaComponent, canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN']}
  },
  {
    path: 'novo', component: ClienteCadEditComponent, canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN']}
  },
  {
    path: ':id', component: ClienteCadEditComponent, canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN']}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
