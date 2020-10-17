import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatorioAnualDemonstrativoComponent } from './relatorio-anual-demonstrativo/relatorio-anual-demonstrativo.component';

import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import { RelatorioAnexoUnicoComponent } from './relatorio-anexo-unico/relatorio-anexo-unico.component';


@NgModule({
  declarations: [RelatorioAnualDemonstrativoComponent, RelatorioAnexoUnicoComponent],
  imports: [
    CommonModule,
    RelatoriosRoutingModule,
    FormsModule,
    TooltipModule,
    TableModule,
    DropdownModule,
    CalendarModule
  ]
})

export class RelatoriosModule { }
