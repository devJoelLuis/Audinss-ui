import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteConsultaComponent } from './cliente-consulta/cliente-consulta.component';
import { ClienteCadEditComponent } from './cliente-cad-edit/cliente-cad-edit.component';

import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {TooltipModule} from 'primeng/tooltip';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';

import { Ng2ImgMaxModule } from 'ng2-img-max';






@NgModule({
  declarations: [ClienteConsultaComponent, ClienteCadEditComponent],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    FormsModule,
    ButtonModule,
    Ng2ImgMaxModule,
    CalendarModule,
    TableModule,
    TooltipModule,
    PaginatorModule
  ]
})
export class ClienteModule { }
