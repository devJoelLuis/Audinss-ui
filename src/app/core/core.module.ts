import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PaginaNaoEncontradaComponent } from './shared/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NaoAutorizadoComponent } from './shared/nao-autorizado/nao-autorizado.component';

import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';

import { JwtModule } from '@auth0/angular-jwt';
import { SobreComponent } from './sobre/sobre.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PaginaNaoEncontradaComponent,
    NavbarComponent,
    NaoAutorizadoComponent,
    SobreComponent,
  ],
  imports: [
  CommonModule,
    RouterModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    HttpClientModule,
    JwtModule,
    TableModule
  ],
  exports: [
    NavbarComponent,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    HttpClientModule
  ],
  providers: [

  ]
})
export class CoreModule { }
