import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { RelatoriosService } from './../relatorios.service';
import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ClienteService } from '../../cliente/cliente.service';
import { MovimentoService } from '../../movimento/movimento.service';
import { LegislacaoService } from '../../legislacao/legislacao.service';

import { MessageService } from 'primeng/api';
import { ClienteDto } from '../../modal/cliente.class';
import { AliquotaDTO } from '../../modal/aliquotasMes.class';
import { Legislacao } from '../../modal/legislacao.class';
import { CalendarioBr } from '../../modal/calendarioBr.class';

import * as moment from 'moment';

@Component({
  selector: 'app-relatorio-anual-demonstrativo',
  templateUrl: './relatorio-anual-demonstrativo.component.html',
  styleUrls: ['./relatorio-anual-demonstrativo.component.css']
})
export class RelatorioAnualDemonstrativoComponent implements OnInit {

  load= false;

  clientesDto:  ClienteDto[] = [];

  aliquotas: AliquotaDTO[] = [];

  legislacaoSelecionada: any;
  legislacoes: string[] = [];

  br = new CalendarioBr();


  clienteSelecionado: any;

  anos = [];
  ano = 0;

  dataFinalSelic = new Date();

  constructor(
    private error: ErrorHandlerService,
    private serviceCli: ClienteService,
    private auth: AuthService,
    private message: MessageService,
    private serviceMov: MovimentoService,
    private serviceLeg: LegislacaoService,
    private location: Location,
    private service: RelatoriosService
  ) {

    this.carregarClientes();

   }

  ngOnInit() {
  }


  gerarRelatorio() {
    if (!this.ano || this.ano == null || this.ano == 0) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'Selecione o ano!', life: 6000 });
       return;
    }
    if (!this.legislacaoSelecionada) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'Selecione a legislação!', life: 6000 });
       return;
    }

     console.log();

     this.load = true;
     this.service.getRelatorioDemonstrativoAnual(this.ano, this.clienteSelecionado.id,
               this.legislacaoSelecionada, moment(this.dataFinalSelic).format('YYYY-MM-DD'))
     .subscribe(
      (val) => {
        this.load = false;
        const url =  window.URL.createObjectURL(val);
        window.open(url);
      }, error => {
        this.load = false;
        this.error.handler(error);
      });
  }



  // carrega clientes dto para o dropdown
carregarClientes() {
  if (this.auth.temPermissao('ROLE_ADMIN')) {
    this.load = true;
    this.serviceCli.getAllDto()
        .toPromise()
        .then( ret => {
           this.load = false;
           this.clientesDto = ret['dados'];

        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });
   } else {

    this.load = true;
    this.serviceCli.getClientesUser(this.auth.jwtPayload['iduser'])
        .toPromise()
        .then( ret => {
           this.load = false;
           this.clientesDto = ret['dados'];

        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });

   }
}


carregarLegislacoes() {
  if (!this.clienteSelecionado) {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Selecione uma Prefeitura.'});
    return;
  }
  this.load = true;
  this.serviceMov.getLegislacoesDosMovimentos(this.clienteSelecionado.id)
      .toPromise()
      .then( ret => {
        this.load = false;
        this.legislacoes = ret['dados'];
        console.log(this.legislacoes);
      })
      .catch( er => {
        this.load = false;
        this.error.handler(er);
      })
}



consultarLancamentos() {

  if (!this.clienteSelecionado) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação',
    detail: 'Selecione o cliente!', life: 6000 });
     return;
  }

  this.load = true;
   this.serviceMov.getAnos(this.clienteSelecionado.id)
       .toPromise()
       .then(ret => {
         this.load = false;
         console.log(ret);
         this.anos = ret['dados'];
         if (this.anos.length > 0) {
          this.carregarLegislacoes();
         } else {
           this.message.add({ severity: 'warn', summary:'Falta de dados',
           detail: 'Prefeitura '+ this.clienteSelecionado.nome +' sem lançamentos de FP ou configuração da FC',  life: 6000});
         }

       })
       .catch( er => {
        this.load = false;
        this.error.handler(er);
       });

}



  voltar() {
    this.location.back();
  }

}//fecha classe
