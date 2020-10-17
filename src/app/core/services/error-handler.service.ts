import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {MessageService} from 'primeng/api';
import { NotAuthenticatedError } from '../seguranca/notAuthenticatedError.class';



@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private message: MessageService,
    private router: Router
  ) { }

  handler(erro: any) {
    console.log(erro);


    if (erro instanceof NotAuthenticatedError) {
      this.message.add( { severity: 'error', summary: 'Erro de sessão',
        detail: 'A sessão expirou, logue no sistema novamente!!!', life: 6000 } );
        this.router.navigate(['/login']);
        return;
    }



    if (erro.status == 0) {
      this.message.add( { severity: 'error', summary: 'Erro de conexão',
      detail: 'Não foi possível conectar com o servidor, verifique a conexão da' +
      ' rede, da internet e se o servidor está ativo', life: 12000 } );
      this.router.navigate(['/']);
      return;
    }

    if (erro.status == 400) {



      if(erro.error.error === 'invalid_grant') {
        this.message.add( { severity: 'error', summary: 'Falha no login',
        detail: 'E-mail ou senha inválidos!!!', life: 6000 } );
        return;
      }

      if (erro.error.erros) {
        if (erro.error.erros[0].includes('org.hibernate.exception.ConstraintViolationException')) {
          this.message.add( { severity: 'error', summary: 'Erro',
          detail: 'A entidade não pode ser excluída ou alterada porque possui registros vinculados.', life: 9000 } );
          return;
        } 
      }

      if (erro.error.errors) {

        if (erro.error.errors.length > 0 && erro.error.errors[0].defaultMessage) {

          for (var i = 0;i < erro.error.errors.length; i++) {
            this.message.add( { severity: 'error', summary: 'Erro',
            detail: erro.error.errors[i].defaultMessage, life: 9000 } );
          }

         return;
        }

      }

      if (erro.error.erros) {
        this.message.add( { severity: 'error', summary: 'Erro',
        detail: erro.error.erros[0], life: 9000 } );
        return;
      }

       this.message.add( { severity: 'error', summary: 'Erro',
        detail: erro.error.message, life: 9000 } );
        return;
    }

    if (erro.status > 400 && erro.status <= 499 ) {

      if (erro.status == 401 || erro.status == 403) {


        if (erro.error.error_description && erro.error.error_description == 'Acesso negado') {
          this.message.add( { severity: 'error', summary: 'Sem Permissão',
          detail: 'Acesso Negado!!!', life: 6000 } );
          this.router.navigate(['/nao-autorizado']);
          return;
        }


        this.message.add( { severity: 'error', summary: 'Erro de sessão',
        detail: 'A sessão expirou, logue no sistema novamente!!!', life: 6000 } );
        this.router.navigate(['/login']);
        return;
      }

    }// erros 400 a 499

    if (erro.status >= 500 && erro.status <= 599) {
      this.message.add( { severity: 'error', summary: 'Erro de servidor',
        detail: 'Ocorreu um erro interno no servidor, anote a ação que estava ' +
        'fazendo e passe para o desenvolvedor do sistema!!!', life: 9000 } );
      return;
    }




  }// fecha metodo



}//fecha classe
