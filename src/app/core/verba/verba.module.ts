import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerbaRoutingModule } from './verba-routing.module';
import { VerbaConsultaComponent } from './verba-consulta/verba-consulta.component';
import { VerbaCadEditComponent } from './verba-cad-edit/verba-cad-edit.component';
import { FcorrecaoConsultaComponent } from './fcorrecao-consulta/fcorrecao-consulta.component';
import { FcorrecaoCadEditComponent } from './fcorrecao-cad-edit/fcorrecao-cad-edit.component';

import {TooltipModule} from 'primeng/tooltip';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';





@NgModule({
  declarations: [
    VerbaConsultaComponent,
    VerbaCadEditComponent,
    FcorrecaoConsultaComponent,
    FcorrecaoCadEditComponent
  ],
  imports: [
  CommonModule,
    VerbaRoutingModule,
    TooltipModule,
    TableModule,
    FormsModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    ButtonModule,
    CalendarModule
  ]
})
export class VerbaModule { }
