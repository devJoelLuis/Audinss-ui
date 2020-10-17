import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxaSelicRoutingModule } from './taxa-selic-routing.module';
import { TaxaSelicConsultaComponent } from './taxa-selic-consulta/taxa-selic-consulta.component';


@NgModule({
  declarations: [TaxaSelicConsultaComponent],
  imports: [
    CommonModule,
    TaxaSelicRoutingModule
  ]
})
export class TaxaSelicModule { }
