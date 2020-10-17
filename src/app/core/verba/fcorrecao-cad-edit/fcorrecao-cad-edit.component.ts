import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MessageService, ConfirmationService } from 'primeng/api';
import { Legislacao } from '../../modal/legislacao.class';
import { VerbaPadrao } from './../../modal/verbaPadrao.class';
import { LegislacaoService } from './../../legislacao/legislacao.service';
import { VerbaService } from './../verba.service';
import { ClienteService } from './../../cliente/cliente.service';
import { FolhaCorrecaoService } from './../folha-correcao.service';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { FolhaCorrecao, FolhaCorrecaoEdit, FolhaCorrecaoLista } from './../../modal/folhaCorrecao.class';
import { ClienteDto } from '../../modal/cliente.class';
import { AuthService } from './../../seguranca/auth.service';

import * as moment from 'moment';
import { CalendarioBr } from '../../modal/calendarioBr.class';


@Component({
  selector: 'app-fcorrecao-cad-edit',
  templateUrl: './fcorrecao-cad-edit.component.html',
  styleUrls: ['./fcorrecao-cad-edit.component.css']
})
export class FcorrecaoCadEditComponent implements OnInit {


  load = false;
  edicao = false;
  comOuSemVerba = false;

  legislacoes: Legislacao[] = [];
  legislacaoSelecionada: any;
  clientesDto: ClienteDto[] = [];
  clienteSelecionado: any;

  now = moment();
  dataEntrada: Date;
  br = new CalendarioBr();

  verbas: VerbaPadrao[] = [];
  fcse: FolhaCorrecaoEdit[] = [];
  fcs: FolhaCorrecao[] = [];
  fc = new FolhaCorrecao();

  css = 'container altura-minima bg-color pad';
  titulo = 'Cadastro da folha de correção';
  tituloTable = 'Configure a tributação para legislação: '

  constructor(
    private service: FolhaCorrecaoService,
    private serviceLeg: LegislacaoService,
    private serviceVerba: VerbaService,
    private serviceCli: ClienteService,
    private error: ErrorHandlerService,
    private location: Location,
    private message: MessageService,
    private confirm: ConfirmationService,
    private auth: AuthService
  ) {
    this.carregarLegislacoes();
    this.carregarClientes();
    const menos5Anos = this.now.subtract(5, 'years').format();
    this.dataEntrada = new Date(menos5Anos);
    console.log(this.dataEntrada);
  }

  ngOnInit() {
  }


  /*
     lógica:
     carregar legislações
     quando o usuário escolher uma legislação no dropdown gerar uma folha de correção na tabela baseada na verbaPadrao
  */

 carregarLegislacoes() {
   this.load = true;
   this.serviceLeg.getAll()
       .toPromise()
       .then( ret => {
         this.load = false;
         this.legislacoes = ret['dados'];
       })
       .catch( er => {
         this.load=false;
         this.error.handler(er);
       });
 }



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





 carregarFcs() {

   if (this.clienteSelecionado && this.legislacaoSelecionada) {

    this.verbas = [];
    this.fcse = [];

    this.load = true;
    this.service.getAllLegislacaoIdClienteId(this.legislacaoSelecionada.id, this.clienteSelecionado.id)
           .toPromise()
           .then( ret => {
             this.load = false;
             this.fcs = ret['dados'];
             if (this.fcs.length > 0) {
               this.convertFcParaFce();
               this.ativaModoEdicao();
             } else {
               this.carregarVerbas();
             }
           })
           .catch( er => {
             this.load = false;
             this.error.handler(er);
           });

   }

 }//fecha carregarFcs


 carregarVerbas() {
   this.load = true;
   this.serviceVerba.getAllClienteId(this.clienteSelecionado.id)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.verbas = ret['dados'];

          this.converterVerbaParaFce();
          this.ativaModoCadastroNovaFolha();
          if (!this.verbas || this.verbas.length == 0) {
            this.comOuSemVerba = true;
          } else {
            this.comOuSemVerba = false;
          }

       })
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       });

 }



 salvarFolhasCorrecao() {

  this.fcs = [];
  this.fcse.map( f => {
    var fc = new FolhaCorrecao();
    fc.convertFcEditToFc(f);
    if (this.legislacaoSelecionada && this.legislacaoSelecionada.exigeDataInicio) {
      fc.dataInicio = this.dataEntrada;
    } else {
      fc.dataInicio = new Date(1991, 0, 1);
    }
    this.fcs.push(fc);
  })
  var fcl = new FolhaCorrecaoLista();
  fcl.fcs = this.fcs;


   if (this.edicao) {

     fcl.fcs.map( v => {
       v.configurado = true;
     })
     
     this.confirm.confirm({
       message: 'Deseja alterar também todos os lançamentos já registrados?',
       accept: () => {
        this.load = true;
        this.service.alteraAllEMovimentos(fcl)
           .toPromise()
           .then( ret => {
             this.load = false;
              this.fcs = ret['dados'];
              this.message.add({severity: 'success', summary: 'Alteração salva',
                  detail: 'A alteração da folha de correção foi salva com sucesso!!!'});
              this.convertFcParaFce();
              this.ativaModoEdicao();
           })
           .catch(er => {
             this.load = false;
             this.error.handler(er);
            });
       },
       reject: () => {
        this.load = true;
        this.service.alteraAll(fcl)
           .toPromise()
           .then( ret => {
             this.load = false;
              this.fcs = ret['dados'];
              this.message.add({severity: 'success', summary: 'Alteração salva',
                  detail: 'A alteração da folha de correção foi salva com sucesso!!!'});
              this.convertFcParaFce();
              this.ativaModoEdicao();
           })
           .catch(er => {
             this.load = false;
             this.error.handler(er);
            });

       }
     });
   } else {
     this.load = true;
     this.service.cadastrarAll(fcl)
         .toPromise()
         .then( ret => {
           this.load = false;
           this.fcs = ret['dados'];
           this.convertFcParaFce();
           this.ativaModoEdicao();
         })
         .catch( er => {
          this.load = false;
          this.error.handler(er);
         });
   }

 }



 exluirFolha() {
   if (this.clienteSelecionado && this.legislacaoSelecionada) {
     this.confirm.confirm({
       message: 'Tem certeza que deseja excluir a folha de correção da legislação '+ this.legislacaoSelecionada.legislacao +'?',
       accept: () => {
         this.load = true;
         this.service.excluirFolha(this.clienteSelecionado.id, this.legislacaoSelecionada.id)
             .toPromise()
             .then( ret => {
                this.load = false;
                this.clienteSelecionado = undefined;
                this.legislacaoSelecionada = undefined;
                this.fcse = [];
                this.ativaModoCadastroNovaFolha();
                this.message.add({severity: 'info', summary: 'Folha de Correção excluída',
                            detail: 'A folha de correção foi excluir com sucesso!!!'});
             })
             .catch( er => {
                this.load = false;
             });
       }
     });
   }
 }


 ativaModoEdicao() {
   this.edicao = true;
   this.css = 'container altura-minima bg-color-edit pad';
   this.titulo = 'Edição da folha de correção';
   this.tituloTable = 'Edite a tributação para legislação: '
 }

 ativaModoCadastroNovaFolha() {
  this.edicao = false;
  this.css = 'container altura-minima bg-color-novo pad';
  this.titulo = 'Cadastro da folha de correção';
  this.tituloTable = 'Configure a tributação para legislação: '
 }


converterVerbaParaFce() {
  this.fcse = [];
  this.verbas.map( v => {
    var fce = new FolhaCorrecaoEdit();
    fce.convertVerbaParaFcEdit(v, this.legislacaoSelecionada.id, this.clienteSelecionado.id);
    if (this.legislacaoSelecionada && this.legislacaoSelecionada.exigeDataInicio) {
      fce.dataInicio = this.dataEntrada;
    }
    this.fcse.push(fce);
  });

}


convertFcParaFce(){
  this.fcse = [];
  this.fcs.map( fc => {
    var fce = new FolhaCorrecaoEdit();
    fce.convertFcToFcEdit(fc);
    if (this.legislacaoSelecionada && this.legislacaoSelecionada.exigeDataInicio) {
      fce.dataInicio = this.dataEntrada;
    }
     this.fcse.push(fce);
  })

}

convertFceParaFc() {
  this.fcs = [];
  this.fcse.map( fce => {
    var fc = new FolhaCorrecao();
    if (this.legislacaoSelecionada && this.legislacaoSelecionada.exigeDataInicio) {
      fc.dataInicio = this.dataEntrada;
    }
    this.fcs.push(fc);
  })
}



goBack() {
  this.location.back();
}





}//fecha classe
