import { Permissao } from './permissao.class';
import { Cliente } from './cliente.class';

export class Usuario {

  id: number;
	email: string;
  nome: string;
	senha = '';
	obs: string;
	permissoes: Permissao[] = [];
	clientes: Cliente[] = [];


} //fecha classe
