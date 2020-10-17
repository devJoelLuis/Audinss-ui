
  export class Cliente {

      id:number;
      nome:string;
      cnpj:string;
      email:string;
      telefone1:string;
      telefone2:string;
      rua:string;
      bairro:string;
      cidade:string;
      cep:string;
      estado:string;
      complemento:string;
      logotipo:string;
      obs:string;
      inicio = new Date();
      fim = new Date();

  }

  export class ClienteDto {
    id: number;
    nome: string;
  }
