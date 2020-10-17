import { AuthService } from './../../seguranca/auth.service';
import { VerbaService } from './../verba.service';
import { Location } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FolhaCorrecao } from './../../modal/folhaCorrecao.class';
import { Component, OnInit } from '@angular/core';
import { VerbaPadrao } from './../../modal/verbaPadrao.class';
import { ClienteDto, Cliente } from '../../modal/cliente.class';
import { ClienteService } from './../../cliente/cliente.service';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verba-cad-edit',
  templateUrl: './verba-cad-edit.component.html',
  styleUrls: ['./verba-cad-edit.component.css']
})
export class VerbaCadEditComponent implements OnInit {


  verba = new VerbaPadrao();
  clisdto: ClienteDto[] = [];
  verbas: VerbaPadrao[] = [];

  load = false;
  titulo = 'Cadastro de verba FP';
  css= 'container altura-minima bg-color pad';

  edicao = false;

  clienteSelecionado: any;


  constructor(
    private serviceCli: ClienteService,
    private service: VerbaService,
    private errorHandler: ErrorHandlerService,
    private message: MessageService,
    private location: Location,
    private route: ActivatedRoute,
    private error: ErrorHandlerService,
    private confirm: ConfirmationService,
    private auth: AuthService
  ) {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.css = 'container altura-minima bg-color-edit pad';
      this.titulo = 'Edição de verba FP';
      this.edicao = true;
      //this.carregarVerba(id);
     // this.carregarClientes();
    } else {
      this.carregarClientes();
    }
  }

  ngOnInit() {
  }


  consultarVerbas() {
    this.verba = new VerbaPadrao();
    if (this.clienteSelecionado) {
      this.load = true;
      this.service.getAllClienteId(this.clienteSelecionado['id'])
          .toPromise()
          .then( ret=> {
             this.load = false;
             this.verbas = ret['dados'];
          })
          .catch( er => {
           this.load = false;
           this.error.handler(er);
          });
    }

 }


  carregarVerba(id: number) {
    this.load = true;
    this.service.getId(id)
        .toPromise()
        .then( ret => {
           this.load = false;
           this.verba = ret['dados'];
           this.clienteSelecionado = {id: this.verba.cliente.id, nome: this.verba.cliente.nome};
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }


  editarVerba(v: VerbaPadrao) {
   this.verba = v;
   this.css = 'container altura-minima bg-color-edit pad';
   this.titulo = 'Edição de verba FP';
   this.edicao = true;
  }


  excluirVerba(v: VerbaPadrao) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja excluír a verba '+ v.descricao+'?',
      accept: () => {
        this.load = true;
        this.service.delete(v.id)
            .toPromise()
            .then(()=>{
             this.load = false;
             this.consultarVerbas();
             this.message.add({severity: 'info', summary: 'Verba Excluída', detail: 'A verba foi excluída com sucesso!!!'});
            })
            .catch(er => {
              this.load = false;
              this.error.handler(er);
            })
      }
    });
 }



  carregarClientes() {
    if (this.auth.temPermissao('ROLE_ADMIN')) {
      this.load = true;
      this.serviceCli.getAllDto()
          .toPromise()
          .then( ret => {
             this.load = false;
             this.clisdto = ret['dados'];
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
             this.clisdto = ret['dados'];
             if (this.clisdto.length == 1) {
               this.clienteSelecionado = this.clisdto[0];
             }
          })
          .catch( er => {
            this.load = false;
            this.error.handler(er);
          });

     }
  }



  salvar() {

    if (this.clienteSelecionado === undefined) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Selecione o Cliente.' });
      return;
    }
    if (!this.clienteSelecionado.id) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Selecione o Cliente.' });
      return;
    }
    if (this.verba.codigo == null) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'O código da verba não foi informado corretamente.' });
      return;
    }
    if (!this.verba.codigo || this.verba.codigo == '') {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'O código da verba não pode ser menor que 1.' });
      return;
    }
    if (!this.verba.descricao) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'A descrição não foi informada corretamente.' });
      return;
    }
    if (this.verba.descricao == undefined || this.verba.descricao == null || this.verba.descricao === '') {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'A descrição não foi informada corretamente.' });
      return;
    }
    if (!this.verba.tipo) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Selecione o Tipo da verba.' });
      return;
    }

     this.verba.cliente = new Cliente();
     this.verba.cliente.id = this.clienteSelecionado.id;

    if (this.edicao) {
      this.confirm.confirm({
        message: 'Deseja que todos os lançamentos já gravados sejam recalculados?',
        accept: () => {
          this.load = true;
          this.service.alterarVerbaMovimentos(this.verba)
              .toPromise()
              .then( ret => {
                this.load = false;
                this.message.add({ severity: 'success', summary: 'Edição Salva', detail: 'A edição foi salva com sucesso!!!' });
                this.modoNovaVerba();
              })
              .catch( er => {
                this.load = false;
                this.errorHandler.handler(er);
                this.modoNovaVerba();
              })
        },
        reject: () => {
          this.load = true;
          this.service.alterar(this.verba)
              .toPromise()
              .then( ret => {
                this.load = false;
                this.message.add({ severity: 'success', summary: 'Edição Salva', detail: 'A edição foi salva com sucesso!!!' });
                this.modoNovaVerba();
              })
              .catch( er => {
                this.load = false;
                this.errorHandler.handler(er);
                this.modoNovaVerba();
              })
        }
      })
    } else {

      this.load = true;
      this.service.cadastrar(this.verba)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.verba.descricao = '';
            this.consultarVerbas();
            this.message.add({ severity: 'success', summary: 'Cadastro realizado', detail: 'O cadastro da verba foi realizado com sucesso!!!' });
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          })
    }
  }


  modoNovaVerba() {
    this.titulo = 'Cadastro de verba FP';
    this.css= 'container altura-minima bg-color-novo pad';
    this.edicao = false;
    this.verba = new VerbaPadrao();
  }


  goback() {
    this.location.back();
  }



}// fecha classe
