import { SobreComponent } from './core/sobre/sobre.component';
import { AuthGuard } from './core/seguranca/auth.guard';


import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { PaginaNaoEncontradaComponent } from './core/shared/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './core/shared/nao-autorizado/nao-autorizado.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';

const routes: Routes = [


  { path: '', component: LoginComponent },
  {path: 'dash', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'sobre', component: SobreComponent, canActivate: [AuthGuard]},


  {path: 'clientes', loadChildren: './core/cliente/cliente.module#ClienteModule'},
  {path: 'verbas', loadChildren: './core/verba/verba.module#VerbaModule'},
  {path: 'movimento', loadChildren: './core/movimento/movimento.module#MovimentoModule'},
  {path: 'usuarios', loadChildren: './core/usuario/usuario.module#UsuarioModule'},
  {path: 'relatorios', loadChildren: './core/relatorios/relatorios.module#RelatoriosModule'},
  {path: 'taxas-selic', loadChildren: './core/taxa-selic/taxa-selic.module#TaxaSelicModule' },
  {path: 'legislacoes', loadChildren: './core/legislacao/legislacao.module#LegislacaoModule'},


  {path: 'nao-autorizado', component: NaoAutorizadoComponent, canActivate: [AuthGuard]},
  {path: 'not-found', component: PaginaNaoEncontradaComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'not-found'}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
