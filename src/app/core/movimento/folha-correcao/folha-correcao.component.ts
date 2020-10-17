import { FolhaCorrecaoService } from './../../verba/folha-correcao.service';
import { Legislacao } from './../../modal/legislacao.class';
import { MovimentoService } from './../movimento.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { ClienteDto } from '../../modal/cliente.class';
import { AliquotasMes, AliquotaDTO } from '../../modal/aliquotasMes.class';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ClienteService } from '../../cliente/cliente.service';
import { AuthService } from '../../seguranca/auth.service';
import { LegislacaoService } from './../../legislacao/legislacao.service';


@Component({
  selector: 'app-folha-correcao',
  templateUrl: './folha-correcao.component.html',
  styleUrls: ['./folha-correcao.component.css']
})
export class FolhaCorrecaoComponent implements OnInit, OnDestroy {

  load= false;
  status: any;

  clientesDto:  ClienteDto[] = [];

  aliquotas: AliquotaDTO[] = [];

  legislacaoSelecionada: any;
  legislacoes: string[] = [];


  clienteSelecionado: any;
  anos: number[] = [];
  mes = 1;
  ano = 2020;

  constructor(
    private error: ErrorHandlerService,
    private serviceCli: ClienteService,
    private auth: AuthService,
    private message: MessageService,
    private service: MovimentoService,
    private serviceFc: FolhaCorrecaoService,
    private location: Location,
    private router: Router,
  ) {



    if (sessionStorage.getItem("statusfc")) {
      this.status = JSON.parse(sessionStorage.getItem("statusfc"));
    }
    this.carregarClientes();
  }

  ngOnInit() {
  }



  urlRelatorio():boolean {
    if (this.router.url == '/movimento/fc/relatorio') {
      return true;
    } else {
      return false;
    }
}




  ngOnDestroy() {
     const status = {
       legislacaoSelecionada: this.legislacaoSelecionada,
       clienteSelecionado: this.clienteSelecionado,
       ano: this.ano
     }

     sessionStorage.setItem("statusfc", JSON.stringify(status));

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
           if (this.status) {
             this.clienteSelecionado = this.status.clienteSelecionado;
             this.carregarLegislacoesMovimentos();
           }
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
           if (this.status) {
            this.clienteSelecionado = this.status.clienteSelecionado;
          }
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });

   }
}


changeCliente() {
  if (this.clienteSelecionado) {
    this.anos = [];
    this.legislacoes = [];
    this.aliquotas = [];
    this.carregarLegislacoesMovimentos();
  }
}


carregarLegislacoesMovimentos() {
  this.load = true;
  this.service.getLegislacoesDosMovimentos(this.clienteSelecionado.id)
      .toPromise()
      .then( ret => {
        this.load = false;
        this.legislacoes = ret['dados'];
        if (this.legislacoes.length == 0) {
          this.message.add({ severity: 'warn', summary: 'Erro Falta de dados',
          detail: 'A Prefeitura '+ this.clienteSelecionado.nome+ ' não possue lançamentos ou FC configurada.', life: 6000 });
        } else {
          if (this.status) {
            this.legislacaoSelecionada = this.status.legislacaoSelecionada;
          }
          this.buscarAnosMovimentos();
        }
      })
      .catch( er => {
        this.load = false;
        this.error.handler(er);
      })
}

buscarAnosMovimentos() {
  this.load = true;
  this.service.getAnos(this.clienteSelecionado.id)
      .toPromise()
      .then( ret => {
        this.load = false;
        this.anos = ret['dados'];
        if (this.status) {
          this.ano = this.status.ano;
          this.consultarLancamentos();
        }
      } )
      .catch( er => {
        this.load = false;
        this.error.handler(er);
      });
}



consultarLancamentos() {
  if (!this.ano) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação',
        detail: 'Selecione o ano.', life: 6000 });
     return;
  }
  if (!this.clienteSelecionado) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação',
    detail: 'Selecione o cliente!', life: 6000 });
     return;
  }
  if (!this.legislacaoSelecionada) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação',
    detail: 'Selecione a legislação!', life: 6000 });
     return;
  }


  this.load = true;
  this.service.getMovimentoClienteIdAnoLegislacao(this.clienteSelecionado.id, this.ano, this.legislacaoSelecionada)
      .toPromise()
      .then( ret => {
        this.load = false;
        this.aliquotas = ret['dados'];
      })
      .catch( er=> {
        this.load = false;
        this.aliquotas = [];
        this.error.handler(er);
      });
}


carregarFc(al: AliquotasMes) {
  const param = { al: al, legislacao: this.legislacaoSelecionada, idcliente: this.clienteSelecionado.id};
  this.router.navigateByUrl('/movimento/fc/edit', { state: { param: param } });
}


relatorio(al: AliquotasMes) {
   if (this.legislacaoSelecionada) {
     this.load = true;
     this.service.getRelatorio(al.ano, al.mes, al.id, this.legislacaoSelecionada)
     .subscribe(
      (val) => {
        this.load = false;
        const url =  window.URL.createObjectURL(val);
        window.open(url);
      }, error => {
        this.load = false;
        this.error.handler(error);
      });
   } else {
     this.message.add({ severity: 'warn', summary: 'Erro validação', detail: 'Selecione uma legislação!!!'});
   }
}


voltar() {
  this.location.back();
}


}//fecha classe
