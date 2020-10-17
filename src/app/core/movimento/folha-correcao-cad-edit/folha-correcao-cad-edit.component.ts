import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


import { ErrorHandlerService } from './../../services/error-handler.service';
import { MovimentoService } from './../movimento.service';
import { Movimento, MovimentoEdit } from './../../modal/movimento.class';
import { AliquotasMes } from './../../modal/aliquotasMes.class';


@Component({
  selector: 'app-folha-correcao-cad-edit',
  templateUrl: './folha-correcao-cad-edit.component.html',
  styleUrls: ['./folha-correcao-cad-edit.component.css']
})
export class FolhaCorrecaoCadEditComponent implements OnInit {

  css = "container bg-color altura-minima pad";

  load = false;
  aliquota = new AliquotasMes();
  legislacao = '';

  movimentosEdit: MovimentoEdit[] = [];

  modoEdicao = false;


  tprovento = 0;
  tbaseCalculo = 0;
  tinss = 0;
  trecuperar = 0;
  tpagar = 0;
  tbaseCalculoFc = 0;

  constructor(
    private router: Router,
    private service: MovimentoService,
    private error: ErrorHandlerService,
    private message: MessageService,
    private location: Location
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav.extras.state) {
      const param = nav.extras.state.param;
       this.carregarMovimentosFC(param);
    } else {
      this.router.navigate(['/movimento/fc']);
    }
   }




  ngOnInit() {
  }







  carregarMovimentosFC(p) {

      this.load = true;
      this.service.getMovimentoFCAliquotaIdAnoMesLegislacao(p.al.id, p.al.ano, p.al.mes, p.legislacao)
         .toPromise()
         .then( ret => {
             // cria uma lista local de movimento nativo para pegar a resposta
           var movimentos: Movimento[] = [];
           movimentos = ret['dados'];
           this.resetarVariaveis();
           var count = 0;
           //percorre a lista para calcular os totais e converter para movimentoEdit
           movimentos.map( m => {
             var mve = new MovimentoEdit();
             if (count === 0) {
               this.aliquota = m.aliquotasMes;
               this.legislacao = m.legislacao;
             }
             mve.movimentoParaMovEdit(m);
             //adiciona na lista global movimento edit para ser exibida para o usuário
             this.movimentosEdit.push(mve);
           });
           this.calcularTotal();
           this.load = false;
         })
         .catch( er => {
           this.load = false;
           this.error.handler(er);
         });
  }


  carregarFc() {
    this.movimentosEdit = [];
    this.load = true;
    this.service.getMovimentoFCAliquotaIdAnoMesLegislacao(this.aliquota.id, this.aliquota.ano, this.aliquota.mes, this.legislacao)
       .toPromise()
       .then( ret => {
           // cria uma lista local de movimento nativo para pegar a resposta
         var movimentos: Movimento[] = [];
         movimentos = ret['dados'];
         this.resetarVariaveis();
         var count = 0;
         //percorre a lista para calcular os totais e converter para movimentoEdit
         movimentos.map( m => {
           var mve = new MovimentoEdit();
           if (count === 0) {
             this.aliquota = m.aliquotasMes;
             this.legislacao = m.legislacao;
           }
           mve.movimentoParaMovEdit(m);
           //adiciona na lista global movimento edit para ser exibida para o usuário
           this.movimentosEdit.push(mve);
         });
         this.calcularTotal();
         this.load = false;
       })
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       });
  }


  editar(m: MovimentoEdit) {
    m.edit = true;
    this.modoEdicao = true;
    this.css = "container bg-color-edit altura-minima pad";
  }

  cancelarEdicao(m: MovimentoEdit) {
    m.edit = false;
    this.modoEdicao = false;
    this.css = "container bg-color altura-minima pad";
    this.carregarFc();
  }

  salvarEdicao(m: MovimentoEdit) {
     var mv = new Movimento();
     mv.convertMovEditParaMovimento(m);
     this.load = true;
     this.service.alterarUm(mv)
         .toPromise()
         .then( () => {
           this.load = false;
           this.message.add({ severity: 'success', summary: 'Verba Salva', detail: 'A alteração da verba foi salva com sucesso!!!' });
           this.cancelarEdicao(m);
         })
         .catch( er => {
           this.load = false;
           this.error.handler(er);
         });
  }




  resetarVariaveis() {
    this.tprovento = 0;
    this.tbaseCalculo = 0;
    this.tinss = 0;
    this.trecuperar = 0;
    this.tpagar = 0;
    this.tbaseCalculoFc = 0;

  }


  calcularTotal() {
    var desconto = 0;
    this.movimentosEdit.map( m => {
      this.tprovento += m.valorProvento;
      this.tbaseCalculo += m.baseCalcInss;
      this.trecuperar += m.valorRecuperar;
      this.tinss += m.valorInssFp;
      this.tpagar += m.valorPagar;
      if (!m.fc && m.fp) {
        desconto += m.valorProvento;
      }
    });
      this.tbaseCalculoFc = this.tbaseCalculo - desconto;
    if (this.tpagar < 0) {
      this.tpagar = this.tpagar * -1;
    }
  }



  recalcular(m: MovimentoEdit) {
    const tali = this.aliquota.inssEmpresa + this.aliquota.inssRat + this.aliquota.inssTerceiros;
    // se desconto tipo é igual a true senão é false
     if (m.tipo) {
        // desconto tem somente baseInss
        if (m.fc && m.fp) {
           m.valorInssFp = (m.baseCalcInss * tali) / 100;
           m.valorPagar = 0;
           m.valorRecuperar = 0;
        }
        if (m.fc && !m.fp) {
           m.valorRecuperar = ((m.baseCalcInss * tali) / 100) * 1;
           m.valorInssFp = 0;
           m.valorPagar = 0;
        }
        if (!m.fc && m.fp) {
           m.valorPagar = ((m.baseCalcInss * tali) / 100) * 1;
           m.valorRecuperar = 0;
           m.valorInssFp = 0;
        }
        if (!m.fc && !m.fp) {

        }
     } else {
        // provento calcula pelo campo provento
        if (m.fc && m.fp) {
           m.baseCalcInss = m.valorProvento;
           m.valorInssFp = (m.baseCalcInss * tali) / 100;
           m.valorPagar = 0;
           m.valorRecuperar = 0;
        }
        if (m.fc && !m.fp) {
          m.baseCalcInss = m.valorProvento;
          m.valorPagar = (m.baseCalcInss * tali) / 100;
          m.valorRecuperar = 0;
          m.valorInssFp = 0;
        }
        if (!m.fc && m.fp) {
          m.baseCalcInss = m.valorProvento;
          m.valorRecuperar = (m.baseCalcInss * tali) / 100;
          m.valorInssFp = (m.baseCalcInss * tali) / 100;
          m.valorPagar = 0;
        }
        if (!m.fc && !m.fp) {
          m.baseCalcInss = m.valorProvento;
          m.valorInssFp = 0;
          m.valorPagar = 0;
          m.valorRecuperar = 0;
        }
      }

      this.calcularTotal();

  }// fecha função recalcular



  goback() {
    this.location.back();
  }


}// fecha classe
