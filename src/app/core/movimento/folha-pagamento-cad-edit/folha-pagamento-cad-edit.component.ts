import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MessageService, ConfirmationService } from 'primeng/api';

import { AliquotasMes } from './../../modal/aliquotasMes.class';
import { MovimentoEdit, MovimentoList } from './../../modal/movimento.class';
import { ClienteDto, Cliente } from '../../modal/cliente.class';
import { Movimento } from '../../modal/movimento.class';
import { AuthService } from '../../seguranca/auth.service';
import { MovimentoService } from '../movimento.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ClienteService } from '../../cliente/cliente.service';
import { VerbaPadrao } from './../../modal/verbaPadrao.class';
import { VerbaService } from './../../verba/verba.service';


@Component({
  selector: 'app-folha-pagamento-cad-edit',
  templateUrl: './folha-pagamento-cad-edit.component.html',
  styleUrls: ['./folha-pagamento-cad-edit.component.css']
})
export class FolhaPagamentoCadEditComponent implements OnInit {

  titulo = 'Lançamento de Folha de Pagamento';
  css = 'container altura-minima bg-color-novo pad';
  load = false;
  edicao = false;

  clientesDto:  ClienteDto[] = [];
  aliquota = new AliquotasMes();
  totalDespesas = 0;
  totalProvento = 0;

  clienteSelecionado: any;
  verbasPadroes: VerbaPadrao[] = [];

  movimentosEdit: MovimentoEdit[] = [];

  totalVerbas = 0;

  constructor(
    private auth: AuthService,
    private service: MovimentoService,
    private serviceCli: ClienteService,
    private error: ErrorHandlerService,
    private serviceVerba: VerbaService,
    private location: Location,
    private message: MessageService,
    private confirm: ConfirmationService,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav.extras.state) {
      this.ativarModoEdicao();
      this.aliquota = nav.extras.state.al;
      this.carregarClientes();
      this.carregarVerbasEdicao(this.aliquota.id);
    } else {
      this.ativaModoNovo();
      this.carregarClientes();
    }
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
           if (this.edicao) {
             this.clienteSelecionado = { id: this.aliquota.cliente.id, nome: this.aliquota.cliente.nome };
           }
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


carregarVerbasEdicao(idAliquota: number) {
  this.load = true;
  this.service.getMovimentoAliquotaId(idAliquota)
      .toPromise()
      .then( ret => {
        this.load = false;
        this.movimentosEdit = [];
        var movimentos: Movimento[] = [];
        movimentos = ret['dados'];
        movimentos.map(mv => {
          var mve = new MovimentoEdit();
          mve.movimentoParaMovEdit(mv);
          this.movimentosEdit.push(mve);
          this.calcularTotais();
        })
      })
      .catch( er => {
        this.load = false;
        this.error.handler(er);
      });
}




carregar() {
   this.carregarJaCadastrada();
}

calcularTotais() {
  this.totalDespesas = 0;
  this.totalProvento = 0;
  this.movimentosEdit.map( m => {
    if (m.valorProvento)
    this.totalProvento += m.valorProvento;
    if (m.baseCalcInss)
    this.totalDespesas += m.baseCalcInss;
  })
}


carregarJaCadastrada() {
  if (this.clienteSelecionado) {
      this.load = true;
      console.log(this.aliquota.mes);
      console.log(this.aliquota.ano);
      console.log('cliente id: ', this.clienteSelecionado.id);
      this.service.getMovimentoFpClienteAnoMes(this.aliquota.ano, this.aliquota.mes, this.clienteSelecionado.id)
          .toPromise()
          .then( ret => {
            this.load = false;
           var movimentos: Movimento[] = [];
            movimentos = ret['dados'];
            if (movimentos.length == 0) {
              this.carregarVerbas();
            } else {
              // converter movimentos para movimentosEdit
              this.movimentosEdit = [];
              var count = 1;
              movimentos.map(mv => {
                if (count == 1) {
                  this.aliquota = mv.aliquotasMes;
                  count = count - 1;
                }
                var mve = new MovimentoEdit();
                mve.movimentoParaMovEdit(mv);
                this.movimentosEdit.push(mve);
              });
              this.ativarModoEdicao();
            }
            this.calcularTotais();
          })
          .catch( er => {
            this.load = false;
            this.error.handler(er);
          });

  }
}



carregarVerbas() {
  if (this.clienteSelecionado) {
    this.load = true;
    this.serviceVerba.getAllClienteId(this.clienteSelecionado.id)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.ativaModoNovo();
          this.verbasPadroes = ret['dados'];
          this.movimentosEdit = [];
          this.verbasPadroes.map( vp => {
            var mve = new MovimentoEdit();
            mve.convertVerbaPadraoToMovEdit(vp);
            this.movimentosEdit.push(mve);
          })

        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });
  }

}



salvar() {
  if (!this.clienteSelecionado) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Selecione o cliente!' });
    return;
  }
  if (this.aliquota.mes < 1 || this.aliquota.mes > 31) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação',
         detail: 'O valor do mês deve estar entre 1 a 12!' });
    return;
  }
  if (this.aliquota.ano < 2000 || this.aliquota.mes > 2100) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação',
         detail: 'O valor do ano deve estar entre 2000 a 2100!' });
    return;
  }

  this.load = true;
  this.aliquota.folhaTipo = 'FP';
  this.aliquota.cliente = new Cliente();
  this.aliquota.cliente.id = this.clienteSelecionado.id;
  if (!this.edicao) {
    this.aliquota.id = null;
  }
  var movimentos: Movimento[] = [];
  this.movimentosEdit.map( mve => {
     var mv = new Movimento();
     mve.aliquotasMes = this.aliquota;
     if (!mve.baseCalcInss)
     mve.baseCalcInss = 0;
     mve.valorInssFp = 0;
     mve.valorRecuperar = 0;
     mve.valorPagar = 0;
     mve.legislacao = "FP";
     mve.fc = mve.fp;
     mv.convertMovEditParaMovimento(mve);
     movimentos.push(mv);
  });

  var ml = new MovimentoList();
  ml.movimentos = movimentos;
  if (this.edicao) {
    this.service.alteraAll(ml)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.ativarModoEdicao();
          movimentos = ret['dados'];
          this.movimentosEdit = [];
          var count = 1;
          movimentos.map(mv => {
            if (count == 1) {
              this.aliquota = mv.aliquotasMes;
              count = count - 1;
            }
            var mve = new MovimentoEdit();
            mve.movimentoParaMovEdit(mv);
            this.movimentosEdit.push(mve);
          })
          this.message.add({ severity: 'success', summary: 'Alteração salva',
               detail: 'A alterações da folha de pagamento foi salva com sucesso!!!'});

        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
          this.movimentosEdit = [];
          this.aliquota.ano = 2020;
          this.aliquota.mes = 1;
          this.clienteSelecionado = undefined;
          this.ativaModoNovo();
        });
  } else {
    this.service.salvaAll(ml)
      .toPromise()
      .then( ret => {
       this.load = false;
       this.ativarModoEdicao();
       movimentos = ret['dados'];
       this.movimentosEdit = [];
       var count = 1;
       movimentos.map(mv => {
         if (count == 1) {
           this.aliquota = mv.aliquotasMes;
           count = count - 1;
         }
         var mve = new MovimentoEdit();
         mve.movimentoParaMovEdit(mv);
         this.movimentosEdit.push(mve);
       })
       this.message.add({ severity: 'success', summary: 'Folha Cadastrada',
            detail: 'A folha de pagamento foi cadastrada com sucesso!!!'});
      })
      .catch( er => {
        this.load = false;
        this.error.handler(er);
        this.aliquota.ano = 2020;
        this.aliquota.mes = 1;
        this.clienteSelecionado = undefined;
        this.ativaModoNovo();
      });
  }




}// fim salvar





excluir() {
  this.confirm.confirm({
    message: 'Tem certeza que deseja excluir a folha de pagamento atual?',
    accept: () => {
      this.load = true;
      this.service.excluirAll(this.aliquota.id)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.ativaModoNovo();
            this.carregarJaCadastrada();
            this.message.add({ severity: 'info', summary: 'Folha excluída',
                detail: 'A folha de pagamento foi excluída com sucesso!!!' });
          })
          .catch( er => {
            this.load = false;
            this.error.handler(er);
          });
    }
  });
}




limpar() {
  this.ativaModoNovo();
  this.movimentosEdit = [];
}



ativarModoEdicao() {
  this.edicao = true;
  this.css = 'container altura-minima bg-color-edit pad';
  this.titulo = 'Edição de Folha de Pagamento';
}




ativaModoNovo() {
  this.edicao = false;
  this.css = 'container altura-minima bg-color-novo pad';
  this.titulo = 'Lançamento de Folha de Pagamento';
  this.movimentosEdit = [];
}




goBack() {
  this.location.back();
}




mudarFocus(event, i) {

 if (event.key == 'ArrowDown' && i < (this.movimentosEdit.length - 1)) {
   document.getElementById(`input${i + 1}`).focus();
 }
 if (event.key == 'ArrowUp' && i > 0) {
   document.getElementById(`input${i - 1}`).focus();
 }
}



}// fecha classe
