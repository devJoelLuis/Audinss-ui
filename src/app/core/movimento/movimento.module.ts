import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimentoRoutingModule } from './movimento-routing.module';
import { FolhaPagamentoComponent } from './folha-pagamento/folha-pagamento.component';
import { FolhaPagamentoCadEditComponent } from './folha-pagamento-cad-edit/folha-pagamento-cad-edit.component';

import {TooltipModule} from 'primeng/tooltip';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';

import { NgxCurrencyModule } from "ngx-currency";
import { FolhaCorrecaoComponent } from './folha-correcao/folha-correcao.component';
import { FolhaCorrecaoCadEditComponent } from './folha-correcao-cad-edit/folha-correcao-cad-edit.component';


@NgModule({
  declarations: [
    FolhaPagamentoComponent,
    FolhaPagamentoCadEditComponent,
    FolhaCorrecaoComponent,
    FolhaCorrecaoCadEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MovimentoRoutingModule,
    TooltipModule,
    TableModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    NgxCurrencyModule
  ]
})
export class MovimentoModule { }
