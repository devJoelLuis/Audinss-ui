
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { MessageService, ConfirmationService } from 'primeng/api';

import { AliquotasMes } from './../../modal/aliquotasMes.class';
import { MovimentoService } from '../movimento.service';
import { Movimento } from '../../modal/movimento.class';
import { AuthService } from '../../seguranca/auth.service';
import { ClienteDto } from '../../modal/cliente.class';
import { ClienteService } from '../../cliente/cliente.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AliquotaService } from '../aliquota.service';

@Component({
  selector: 'app-folha-pagamento',
  templateUrl: './folha-pagamento.component.html',
  styleUrls: ['./folha-pagamento.component.css']
})
export class FolhaPagamentoComponent implements OnInit {

  load = false;

  clientesDto:  ClienteDto[] = [];
  aliquotas: AliquotasMes[] = [];
  anos = [];

  clienteSelecionado: any;
  mes = 1;
  ano = 2020;

  movimentos: Movimento[] = [];

  constructor(
    private error: ErrorHandlerService,
    private serviceCli: ClienteService,
    private auth: AuthService,
    private message: MessageService,
    private service: AliquotaService,
    private serviceMov: MovimentoService,
    private location: Location,
    private router: Router,
    private confirm: ConfirmationService
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


carregarAnosFp() {
  if (this.clienteSelecionado) {
    this.load = true;
    this.serviceMov.getAnosFp(this.clienteSelecionado.id)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.anos = ret['dados'];
         if (this.ano) {
           this.consultarLancamentos();
         }
       } )
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       } );
  }
}




consultarLancamentos() {
  if (this.ano > 2100 || this.ano < 2000) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação',
        detail: 'O ano deve ser maior que 2000 e menor que 2100!', life: 6000 });
     return;
  }
  if (!this.clienteSelecionado) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação',
    detail: 'Selecione o cliente!', life: 6000 });
     return;
  }


  this.load = true;
  this.service.getAllClienteIdFpAno(this.clienteSelecionado.id, this.ano)
      .toPromise()
      .then( ret => {
        this.load = false;
        this.aliquotas = ret['dados'];
      })
      .catch( er=> {
        this.load = false;
        this.error.handler(er);
      });
}




editar(al: AliquotasMes) {
  this.router.navigateByUrl('/movimento/fp',{ state: { al : al} });
}


excluir(al: AliquotasMes) {
  this.confirm.confirm({
    message: 'Tem certeza que deseja remover a folha de pagamento, ano '+al.ano+', mês '+al.mes+ '?',
    accept: () => {
      this.load = true;
      this.serviceMov.excluirAll(al.id)
         .toPromise()
         .then( () => {
           this.load = false;
           this.message.add({ severity: 'info', summary: 'FP excluída', detail: 'A Folha de Pagamento foi excluída com sucesso!!!' });
           this.consultarLancamentos();
         })
         .catch( er => {
           this.load = false;
           this.error.handler(er);
         });
    }
  });
}

novoLancamento() {
  this.router.navigate(['/movimento/fp']);
}

goback() {
  this.location.back();
}


}// fecha classe
