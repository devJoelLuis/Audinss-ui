import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../seguranca/auth.guard';
import { VerbaCadEditComponent } from './verba-cad-edit/verba-cad-edit.component';
import { FcorrecaoCadEditComponent } from './fcorrecao-cad-edit/fcorrecao-cad-edit.component';

const routes: Routes = [
 // {path: '', component:VerbaConsultaComponent, canActivate: [AuthGuard]},
  {path: '', component:VerbaCadEditComponent, canActivate: [AuthGuard]},
  {path: 'fcorrecao', component:FcorrecaoCadEditComponent, canActivate: [AuthGuard]},
 // {path: 'fcorrecao/nova', component:FcorrecaoCadEditComponent, canActivate: [AuthGuard]},
//  {path: 'fcorrecao/:id', component:FcorrecaoCadEditComponent, canActivate: [AuthGuard]},
 // {path: ':id', component:VerbaCadEditComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class VerbaRoutingModule { }
