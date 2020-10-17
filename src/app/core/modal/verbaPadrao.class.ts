
import { Cliente } from './cliente.class';

export class VerbaPadrao {

  id: number;
  codigo: string;
  descricao: string;
	tipo = 'PROVENTO';
	fp = 'T';
  obs: string;
  configurada = false;
  cliente = new Cliente();

}

