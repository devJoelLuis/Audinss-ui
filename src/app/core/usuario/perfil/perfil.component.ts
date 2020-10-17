import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { UsuarioService } from '../usuario.service';
import { AuthService } from '../../seguranca/auth.service';
import { ErrorHandlerService } from './../../services/error-handler.service';

import { MessageService } from 'primeng/api';
import { Usuario } from '../../modal/usuario.class';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {



  usuario = new Usuario();
  load = false;
  resenha = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private service: UsuarioService,
    private message: MessageService,
    private errorHandle: ErrorHandlerService,
    private auth: AuthService
  ) {
    const email = this.route.snapshot.params['email'];
    if (email) {
      this.buscarUsuario(email);
    }
   }

  ngOnInit() {
  }

  buscarUsuario(email) {
    this.load = true;
    this.service.getByEmail(email)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.usuario = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.errorHandle.handler(er);
        });
  }

  salvar() {
    if(this.usuario.nome == undefined || this.usuario.nome == '') {
      this.message.add( { severity: 'warn', summary: 'Erro de Validação',
         detail: 'Nome não informado!!!' } );
      return;
    }
    if(this.usuario.email == undefined || this.usuario.email == '') {
      this.message.add( { severity: 'warn', summary: 'Erro de Validação',
         detail: 'E-mail não informado!!!' } );
      return;
    }
      if(this.usuario.senha == undefined || this.usuario.senha == '') {
        this.message.add( { severity: 'warn', summary: 'Erro de Validação',
           detail: 'Senha não informada!!!' } );
        return;
      }
      if(this.usuario.senha.length < 6) {
        this.message.add( { severity: 'warn', summary: 'Erro de Senha',
           detail: 'A senha deve conter no mínimo 6 (seis) dígitos!!!' } );
        return;
      }
      if(this.resenha == undefined || this.resenha == '') {
        this.message.add( { severity: 'warn', summary: 'Erro de Validação',
           detail: 'Redigite a senha!!!' } );
        return;
      }
      if(this.usuario.senha !== this.resenha) {
        this.message.add( { severity: 'warn', summary: 'Erro de Senha',
           detail: 'As senha digitadas não são iguais!!!' } );
        return;
      }


      this.usuario.nome = this.usuario.nome.toUpperCase();
      this.usuario.email = this.usuario.email.toLowerCase();


      this.load = true;
      this.service.alterar(this.usuario)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add( { severity: 'success', summary: 'Alteração salva',
               detail: 'A alteração foi salva com sucesso, logue novamente no sistema!!!' });
            this.auth.logout();
          })
          .catch( er => {
            this.load = false;
            this.errorHandle.handler(er);
          });
  }


  goBack() {
    this.location.back();
  }

}//fecha classe
