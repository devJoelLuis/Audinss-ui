import { VerbaPadrao } from './verbaPadrao.class';
import { Legislacao } from './legislacao.class';
import { Cliente } from './cliente.class';

export class FolhaCorrecao {
  id: number;
  fc = 'T';
  dataInicio: Date;
  verbaPadrao: VerbaPadrao;
  legislacao: Legislacao;
  cliente = new Cliente();
  configurado = false;

  convertFcEditToFc(fce: FolhaCorrecaoEdit) {
    this.id = fce.id;
    if (fce.fc) {
      this.fc = 'T';
    } else {
      this.fc = 'NT';
    }
    this.dataInicio = fce.dataInicio;
    this.verbaPadrao = fce.verbaPadrao;
    this.legislacao = fce.legislacao;
    this.cliente = fce.cliente;
    this.configurado = fce.configurado;
  }

}

export class FolhaCorrecaoEdit {
  id: number;

  verbaPadrao = new VerbaPadrao();
  legislacao = new Legislacao();
  dataInicio: Date;
  edit = false;
  cliente = new Cliente();
  fc = true;
  configurado = false;

  convertFcToFcEdit(fc: FolhaCorrecao) {
    this.id = fc.id;
    if (fc.fc === 'T' ) {
      this.fc = true;
    } else {
      this.fc = false;
    }
    this.dataInicio = fc.dataInicio;
    this.verbaPadrao = fc.verbaPadrao;
    this.legislacao = fc.legislacao;
    this.edit = false;
    this.cliente = fc.cliente;
    this.configurado = fc.configurado;
  }

  convertVerbaParaFcEdit(v: VerbaPadrao, idleg: number, idcli: number) {
     this.verbaPadrao = v;
     this.legislacao.id = idleg;
     this.cliente.id = idcli;
     if (v.fp === 'T') {
       this.fc = true;
     } else {
       this.fc = false;
     }
  }

}


export class FolhaCorrecaoLista {
   fcs: FolhaCorrecao[] = [];
}

