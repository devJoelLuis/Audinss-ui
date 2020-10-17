import { LegislacaoService } from './../../legislacao/legislacao.service';

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ClienteDto } from '../../modal/cliente.class';
import { CalendarioBr } from '../../modal/calendarioBr.class';

import { ErrorHandlerService } from '../../services/error-handler.service';
import { ClienteService } from '../../cliente/cliente.service';
import { AuthService } from '../../seguranca/auth.service';
import { MovimentoService } from '../../movimento/movimento.service';
import { RelatoriosService } from '../relatorios.service';

import { MessageService } from 'primeng/api';

import * as moment from 'moment';





@Component({
  selector: 'app-relatorio-anexo-unico',
  templateUrl: './relatorio-anexo-unico.component.html',
  styleUrls: ['./relatorio-anexo-unico.component.css']
})
export class RelatorioAnexoUnicoComponent implements OnInit {

  clientesDto:  ClienteDto[] = [];


  load = false;



  legislacaoSelecionada: any;
  legislacoes: string[];

  br = new CalendarioBr();


  clienteSelecionado: any;

  anos = [];
  ano = 0;

  dataFinalSelic = new Date();

  constructor(
    private location: Location,
    private error: ErrorHandlerService,
    private serviceCli: ClienteService,
    private auth: AuthService,
    private message: MessageService,
    private serviceMov: MovimentoService,
    private service: RelatoriosService,
    private serviceLeg: LegislacaoService
  ) {

    this.carregarClientes();
  }

  ngOnInit() {
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
          this.carregarLegislacoesDosMovimentosComArtigo();
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


carregarLegislacoesDosMovimentosComArtigo() {
  this.load = true;
  this.serviceLeg.getAllArtigos()
      .toPromise()
      .then( ret => {
        this.load = false;
        this.legislacoes  = ret['dados'];
        if (this.legislacoes.length == 0) {
          this.message.add({severity: 'warn', summary: 'Legislações não encontradas', detail:'Nenhuma legislação com artigo foi encontrada.'});
        }
      })
      .catch( er => {
        this.load = false;
        this.error.handler(er);
      })

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
   this.service.getRelatoriAnexoUnico(this.ano, this.clienteSelecionado.id,
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



  voltar() {
    this.location.back();
  }

}//fecha classe
