import { UsuarioCadEditComponent } from './usuario-cad-edit/usuario-cad-edit.component';
import { UsuarioConsultaComponent } from './usuario-consulta/usuario-consulta.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from '../seguranca/auth.guard';


const routes: Routes = [
  { path: '', component: UsuarioConsultaComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN']} },
  { path: 'novo', component: UsuarioCadEditComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN']} },
  { path: 'perfil/:email', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: ':id', component: UsuarioCadEditComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN']} },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
