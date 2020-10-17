import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Usuario } from './../../modal/usuario.class';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { UsuarioService } from './../usuario.service';


import { MessageService, ConfirmationService } from 'primeng/api';




@Component({
  selector: 'app-usuario-consulta',
  templateUrl: './usuario-consulta.component.html',
  styleUrls: ['./usuario-consulta.component.css']
})
export class UsuarioConsultaComponent implements OnInit {

  usuarios: Usuario[] = [];

  load = false;

  nome = '';
  totalRegistro = 0;
  page = 0;
  size = 20;

  constructor(
    private service: UsuarioService,
    private error: ErrorHandlerService,
    private confirm: ConfirmationService,
    private message: MessageService,
    private router: Router
  ) {
    this.consultar();
   }

  ngOnInit() {
  }



  keyUp(event) {
    if(event.key === 'Enter') {
      this.page = 0;
      this.consultar();
    }
  }



  consultar() {
    this.load = true;
    this.service.getAll(this.page, this.size, this.nome)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.usuarios = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });
  }


  novoUsuario() {
    this.router.navigate(['/usuarios/novo']);
  }

  excluirUsuario(u: Usuario) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja excluir o usuário '+ u.nome+ '?',
      accept: () => {
        this.load = true;
        this.service.excluir(u.id)
          .toPromise()
          .then(() => {
            this.load = false;
            this.message.add({ severity: 'info', summary: 'Usuário excluído', detail: 'O usuário foi excluído com sucesso!!'});
            this.consultar();
          })
          .catch(er => {
            this.load = false;
            this.error.handler(er);
          });
      }
    });
  }



  editarUsuario(id: number) {
    this.router.navigate(['/usuarios', id]);
  }


  paginate(event) {
    this.size = event.rows;
    this.page = event.page;
    this.consultar();
  }




}// fecha classe
