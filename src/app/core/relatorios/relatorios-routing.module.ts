import { RelatorioAnexoUnicoComponent } from './relatorio-anexo-unico/relatorio-anexo-unico.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../seguranca/auth.guard';
import { RelatorioAnualDemonstrativoComponent } from './relatorio-anual-demonstrativo/relatorio-anual-demonstrativo.component';


const routes: Routes = [
  {path: 'anual-demonstrativo', component: RelatorioAnualDemonstrativoComponent, canActivate: [AuthGuard] },
  {path: 'anexo-unico', component: RelatorioAnexoUnicoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RelatoriosRoutingModule { }
