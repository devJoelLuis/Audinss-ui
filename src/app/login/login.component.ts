import { versao } from './../core/modal/versao';

import { Component, OnInit } from '@angular/core';
import { AuthService } from './../core/seguranca/auth.service';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from './../core/services/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  email = '';
  senha = '';
  load = false;
  versao = versao.version;

  constructor(
    private auth: AuthService,
    private router: Router,
    private message: MessageService,
    private error: ErrorHandlerService
  ) {
    localStorage.clear();
    sessionStorage.clear();
   }

  ngOnInit() {
  }

  keyUp(event) {
    if (event.key == 'Enter') {
      this.logar();
    }
  }

  logar() {
    if(this.email === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de email', detail: 'E-mail inválido!!' } );
      return;
     }
     if(this.email === '') {
       this.message.add( { severity: 'warn', summary: 'Erro de email', detail: 'E-mail inválido!!' } );
       return;
     }
     if(this.senha === undefined) {
       this.message.add( { severity: 'warn', summary: 'Erro de senha', detail: 'Senha inválida!!' } );
       return;
     }
     if(this.senha === '') {
       this.message.add( { severity: 'warn', summary: 'Erro de email', detail: 'Senha inválida!!' } );
       return;
     }
   this.load = true;
   this.email.toLocaleLowerCase();
    this.auth.login(this.email, this.senha)
       .then(() => {
         this.load = false;
       })
       .catch(() => {
         this.load = false;
       });
  }




  esqueceuSenha() {
    if (this.email == undefined || this.email == '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Informe o email!!!' } );
      return;
    }
    this.load = true;
    this.auth.esqueceSenha(this.email)
        .toPromise()
        .then( () => {
          this.load = false;
          this.message.add( { severity: 'info', summary: 'Email Enviado',
            detail: 'Um e-mail foi enviado para '+ this.email +" com a nova senha" });
        })
        .catch( er => {
           this.load = false;
           this.error.handler(er);
        });
  }



}// fecha classe
