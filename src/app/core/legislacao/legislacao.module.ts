import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegislacaoRoutingModule } from './legislacao-routing.module';
import { LegislacaoConsultaComponent } from './legislacao-consulta/legislacao-consulta.component';
import { LegislacaoCadEditComponent } from './legislacao-cad-edit/legislacao-cad-edit.component';

import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  declarations: [LegislacaoConsultaComponent, LegislacaoCadEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    LegislacaoRoutingModule,
    TooltipModule
  ]
})
export class LegislacaoModule { }
