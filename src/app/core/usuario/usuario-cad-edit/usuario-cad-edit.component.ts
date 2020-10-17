import { Permissao } from './../../modal/permissao.class';
import { MessageService } from 'primeng/api';
import { ClienteService } from './../../cliente/cliente.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Usuario } from './../../modal/usuario.class';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { UsuarioService } from './../usuario.service';
import { Cliente } from '../../modal/cliente.class';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuario-cad-edit',
  templateUrl: './usuario-cad-edit.component.html',
  styleUrls: ['./usuario-cad-edit.component.css']
})
export class UsuarioCadEditComponent implements OnInit {


  css = 'container bg-color-novo altura-minima pad';
  titulo = 'Cadastro de novo Usuário';
  usuario = new Usuario();
  resenha = '';
  edicao = false;
  load=false;
  permissoes = [{id: 1, permissao: 'ADMINISTRADOR'}, {id: 2, permissao: 'USUÁRIO'}];
  permissaoSelecionada: any;


  //variáveis usadas na manipulação de clientes
  clientes: Cliente[] = [];

  param ='';
  page = 0;
  size = 20;
  totalRegistro = 0;

  alterarSenha = false;


  constructor(
    private service: UsuarioService,
    private serviceCli: ClienteService,
    private error: ErrorHandlerService,
    private location: Location,
    private message: MessageService,
    private route: ActivatedRoute,
  ) {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.edicao = true;
      this.css = 'container bg-color-edit altura-minima pad';
      this.titulo = 'Edição de Usuário';
      this.carregarUsuário(id);
    } else {
      this.consultarCliente();
    }
   }

  ngOnInit() {
  }



  carregarUsuário(id: number) {
    this.load = true;
    this.service.getById(id)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.usuario = ret['dados'];
         this.usuario.senha = '';
         const permissao = this.usuario.permissoes[0];
         this.permissaoSelecionada = new Permissao();
         if (permissao.permissao == 'ROLE_ADMIN') {
           this.permissaoSelecionada.id = permissao.id;
           this.permissaoSelecionada.permissao = 'ADMINISTRADOR';
         } else {
          this.permissaoSelecionada.id = permissao.id;
          this.permissaoSelecionada.permissao = 'USUÁRIO';
         }
         this.consultarCliente();
       })
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       });
  }




  onSubmit(f) {
    if (f.valid) {

      if (!this.permissaoSelecionada) {
        this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Nenhuma permissão foi selecionada!!!' });
        return;
      }
      if (this.permissaoSelecionada.permissao === 'USUÁRIO' && this.usuario.clientes.length == 0) {
        this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Nenhuma cliente foi vinculado ao usuário!!!' });
        return;
      }
      if (this.permissaoSelecionada.permissao === 'ADMINISTRADOR') {
        this.usuario.clientes = [];
        this.usuario.permissoes = [];
        var p = new Permissao();
        p.id = this.permissaoSelecionada.id;
        p.permissao = 'ROLE_ADMIN';
        this.usuario.permissoes.push(p);
      } else {
        this.usuario.permissoes = [];
        var p = new Permissao();
        p.id = this.permissaoSelecionada.id;
        p.permissao = 'ROLE_USER';
        this.usuario.permissoes.push(p);
      }

      if (this.edicao) {
        if (this.alterarSenha) {
          if (this.usuario.senha == undefined) {
            this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Digite a senha do usuário!!!' });
            return;
          }
          if (this.usuario.senha == '') {
            this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Digite a senha do usuário!!!' });
            return;
          }
          if (this.usuario.senha == null) {
            this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Digite a senha do usuário!!!' });
            return;
          }
        } else {
          this.usuario.senha = '';
        }

        this.load = true;
        this.service.alterar(this.usuario)
           .toPromise()
           .then( () => {
             this.load = false;
             this.message.add({ severity: 'success', summary: 'Alteração salva',
               detail: 'A alteração no usuário foi salva com sucesso!!!'});
               this.location.back();
           })
           .catch( er => {
             this.load = false;
             this.error.handler(er);
           });

      } else {
        this.load = true;
        this.service.cadastrar(this.usuario)
            .toPromise()
            .then( ret => {
              this.load = false;
              this.usuario = new Usuario();
              this.page = 0;
              this.size = 20;
              this.permissaoSelecionada = undefined;
              this.message.add({ severity: 'success', summary: 'Usuário cadastrado',
                 detail: 'O usuário foi cadastrado com sucesso!!!'});
              f.reset();
            })
            .catch( er => {
              this.load = false;
              this.error.handler(er);
            });
      }


    }//fecha if f.valid
  }//fecha submit



  goback() {
   this.location.back();
  }


  // consultar clientes
  consultarCliente() {
    this.load = true;
    this.serviceCli.getAll(this.page, this.size, this.param)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.clientes = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          this.clientes.map( c => {
            c.inicio = new Date(`${c.inicio} 00:00:00 GMT-0300`);
            c.fim = new Date(`${c.fim} 00:00:00 GMT-0300`);
          });

          // reorganizar lista
          if (this.edicao) {
            var temp: Cliente[] = [];
            this.clientes.map(c => {
              var teste = true;
              this.usuario.clientes.map(cliu => {
                if (c.id == cliu.id) {
                  teste = false;
                }
              });
              if (teste) {
                temp.push(c);
              }
            });
            this.clientes = temp;
            // reorganizar lista em ordem alfabética
            this.clientes.sort((a, b) => {
              if (a.nome < b.nome) {
                    return -1;
                  }
                  if ( a.nome > b.nome ) {
                    return 1;
                  }
                  return 0;
             });
          }
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        })
  }


  paginate(event) {
    this.size = event.rows;
    this.page = event.page;
    this.consultarCliente();
  }


  vincular(cli: Cliente) {
    this.usuario.clientes.push(cli);
    //remover da lista
    var temp: Cliente[] = [];
    this.clientes.map( c => {
      if (c.id != cli.id) {
        temp.push(c);
      }
    });
    this.clientes = temp;
    //colocar a lista principal em ordem alfabética
    this.clientes.sort((a, b) => {
      if (a.nome < b.nome) {
            return -1;
          }
          if ( a.nome > b.nome ) {
            return 1;
          }
          return 0;
     });
     //colocar a lista de cliente do usuário em ordem alfabética
     this.usuario.clientes.sort((a, b) => {
      if (a.nome < b.nome) {
            return -1;
          }
          if ( a.nome > b.nome ) {
            return 1;
          }
          return 0;
        });
  }


  desvincular(c: Cliente) {
     //adiciona ao principal
     this.clientes.push(c);
     //remover do usuario
     var temp: Cliente[] = [];
     this.usuario.clientes.map( cli => {
       if (cli.id != c.id) {
         temp.push(cli);
       }
     });
     this.usuario.clientes = temp;
       //colocar a lista principal em ordem alfabética
    this.clientes.sort((a, b) => {
      if (a.nome < b.nome) {
            return -1;
          }
          if ( a.nome > b.nome ) {
            return 1;
          }
          return 0;
     });
     //colocar a lista de cliente do usuário em ordem alfabética
     this.usuario.clientes.sort((a, b) => {
      if (a.nome < b.nome) {
            return -1;
          }
          if ( a.nome > b.nome ) {
            return 1;
          }
          return 0;
        });
  }



}// fecha classe
