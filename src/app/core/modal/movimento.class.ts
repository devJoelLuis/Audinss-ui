
import { VerbaPadrao } from './verbaPadrao.class';

import { AliquotasMes } from './aliquotasMes.class';


export class Movimento {
  id: number;
	valorProvento = 0;
  baseCalcInss: number;
  valorInssFp: number;
  valorRecuperar: number;
	valorPagar: number;
	aliquotasMes: AliquotasMes;
  fp: string;
  fc: string;
  codigo: string;
  descricao: string;
  tipo: string;
  legislacao: string;

  convertMovEditParaMovimento(mve: MovimentoEdit) {
    if (mve.fp) {
      this.fp = 'T';
    } else {
      this.fp = 'NT';
    }
    if (mve.fc) {
      this.fc = 'T';
    } else {
      this.fc = 'NT';
    }
    if (mve.id)
    this.id = mve.id;
    this.valorProvento = mve.valorProvento;
    this.baseCalcInss = mve.baseCalcInss;
    this.valorInssFp = mve.valorInssFp;
    this.valorRecuperar = mve.valorRecuperar;
    this.valorPagar = mve.valorPagar;
    this.aliquotasMes = mve.aliquotasMes;
    this.codigo = mve.codigo;
    this.descricao = mve.descricao;
    if (mve.tipo) {
      this.tipo = 'DESCONTO';
      if (this.baseCalcInss > 0)
      this.baseCalcInss = this.baseCalcInss * -1;
    } else {
      this.tipo = 'PROVENTO';
    }
    this.legislacao = mve.legislacao;
 }

}



export class MovimentoEdit {
  id: number;
	valorProvento = 0;
  baseCalcInss: number;
  valorInssFp: number;
  valorRecuperar: number;
	valorPagar: number;
	aliquotasMes: AliquotasMes;
  fp = true;
  fc = false;
  codigo: string;
  descricao: string;
  tipo = false;
  legislacao: string;
  edit = false;


  convertVerbaPadraoToMovEdit(v: VerbaPadrao) {
    this.descricao = v.descricao;
    if (v.tipo == 'DESCONTO') {
      this.tipo = true;
    } else {
      this.tipo = false;
    }
    this.codigo = v.codigo;
    if (v.fp === 'T') {
      this.fp = true;
    } else {
      this.fp = false;
    }
  }

  movimentoParaMovEdit(m: Movimento) {
    this.id = m.id;
    this.valorProvento = m.valorProvento;
    this.baseCalcInss = m.baseCalcInss;
    this.valorInssFp = m.valorInssFp;
    this.valorRecuperar = m.valorRecuperar;
    this.valorPagar = m.valorPagar;
    this.aliquotasMes = m.aliquotasMes;
    if (m.fp === 'T') {
      this.fp = true;
    } else {
      this.fp = false;
    }
    if (m.fc === 'T') {
      this.fc = true;
    } else {
      this.fc = false;
    }
    this.codigo = m.codigo;
    this.descricao = m.descricao;
    if (m.tipo == 'DESCONTO') {
      this.tipo = true;
    } else {
      this.tipo = false;
    }
    this.legislacao = m.legislacao;
  }



}


export class MovimentoList {
  movimentos: Movimento[] = [];
}
