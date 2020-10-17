import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Cliente } from '../../modal/cliente.class';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { ClienteService } from './../cliente.service';

import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cliente-consulta',
  templateUrl: './cliente-consulta.component.html',
  styleUrls: ['./cliente-consulta.component.css']
})
export class ClienteConsultaComponent implements OnInit {


  load=false;

  clientes: Cliente[] = [];

  param ='';
  page = 0;
  size = 20;
  totalRegistro = 0;

  constructor(
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private service: ClienteService,
    private confirm: ConfirmationService,
    private message: MessageService

  ) {
    this.consultar();
  }

  ngOnInit() {
  }


  consultar() {
    this.load = true;
    this.service.getAll(this.page, this.size, this.param)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.clientes = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          this.clientes.map( c => {
            c.inicio = new Date(`${c.inicio} 00:00:00 GMT-0300`);
            c.fim = new Date(`${c.fim} 00:00:00 GMT-0300`);
          })
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        })
  }

  keyUp(event) {
    if(event.key === 'Enter') {
      this.page = 0;
      this.consultar();
    }
  }



  novoCliente() {
    this.router.navigate(['/clientes/novo']);
  }


  editarCliente(id: number) {
    this.router.navigate(['/clientes', id]);
  }

 excluirCliente(c: Cliente) {
   this.confirm.confirm({
     message: `Tem certeza que deseja excluir o cliente ${c.nome}?`,
     accept: () => {
        this.load = true;
        this.service.delete(c.id)
            .toPromise()
            .then(() => {
              this.load = false;
              this.consultar();
              this.message.add({ severity: 'info', summary: 'Cliente excluído', detail:'O cliente foi excluído com sucesso!!!'});
            })
            .catch( er => {
              this.load = false;
              this.errorHandler.handler(er);
            })
     }
   });
 }


 paginate(event) {
   this.size = event.rows;
   this.page = event.page;
   this.consultar();
 }


}//fecha classe
