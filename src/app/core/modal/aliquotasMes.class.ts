import { Cliente } from './cliente.class';

export class AliquotasMes {
  id: number;
  mes = 1;
  ano = 2020;
  inssEmpresa = 0;
  inssTerceiros = 0;
  inssRat = 0;
  obs: string;
  folhaTipo: string;
  cliente: Cliente;
  dataInicio = new Date(1991, 0, 1 );
}

export class AliquotaDTO {
  id: number;
  mes = 1;
  ano = 2020;
  obs: string;

}
