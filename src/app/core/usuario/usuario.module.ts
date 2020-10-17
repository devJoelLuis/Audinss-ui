import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuarioConsultaComponent } from './usuario-consulta/usuario-consulta.component';
import { UsuarioCadEditComponent } from './usuario-cad-edit/usuario-cad-edit.component';

import {TooltipModule} from 'primeng/tooltip';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';




@NgModule({
  declarations: [PerfilComponent, UsuarioConsultaComponent, UsuarioCadEditComponent],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
    TooltipModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule
  ]
})
export class UsuarioModule { }
