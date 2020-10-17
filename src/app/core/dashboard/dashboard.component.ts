import { versao } from './../modal/versao';
import { ClienteDashDto } from './../modal/clienteDashDto.class';
import { ClienteService } from './../cliente/cliente.service';
import { AuthService } from './../seguranca/auth.service';
import { ErrorHandlerService } from './../services/error-handler.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  load = false;
  clientesDash: ClienteDashDto[] = [];
  versao = versao.version;

  constructor(
    private error: ErrorHandlerService,
    public auth: AuthService,
    private serviceCli: ClienteService
  ) {
    this.carregarClientesDoUsuario();
  }

  ngOnInit() {

  }


  carregarClientesDoUsuario() {
    if (!this.auth.temPermissao('ROLE_ADMIN')) {
      this.load = true;
      this.serviceCli.getClientesUserDash()
          .toPromise()
          .then( ret => {
            this.load = false;
            this.clientesDash = ret['dados'];
            this.clientesDash.map( c => {
              c.inicio = new Date(`${c.inicio} 00:00:00 GMT-0300`);
              c.fim = new Date(`${c.fim} 00:00:00 GMT-0300`);
              c.datServidor =  new Date(`${c.datServidor} 00:00:00 GMT-0300`);
            });
          })
          .catch( er => {
            this.load = false;
            this.error.handler(er);
          });
    }
  }


} //fecha classe
