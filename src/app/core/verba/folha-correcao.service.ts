import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FolhaCorrecao, FolhaCorrecaoLista } from './../modal/folhaCorrecao.class';

@Injectable({
  providedIn: 'root'
})
export class FolhaCorrecaoService {


  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
  }


  //cadastrar
  cadastrar(f: FolhaCorrecao) {
    return this.http.post(`${this.url}/correcoes`, f);
  }

  //alterar

  //excluir
  excluirFolha(idcliente: number, idleg: number) {
    return this.http.delete(`${this.url}/correcoes/folha?idlegislacao=${idleg}&idcliente=${idcliente}`);
  }

  //get all legislação id
  getAllLegislacaoId(idleg: number) {
    return this.http.get(`${this.url}/correcoes/legislacao/${idleg}`);
  }

   //get all legislação id
   getAllLegislacaoIdClienteId(idleg: number, idcliente: number) {
    return this.http.get(`${this.url}/correcoes/legislacao-cliente?idlegislacao=${idleg}&idcliente=${idcliente}`);
  }

  //get id
  getById(id: number) {
    return this.http.get(`${this.url}/correcoes/${id}`);
  }

 // save all
  cadastrarAll(fcs: FolhaCorrecaoLista) {
    return this.http.post(`${this.url}/correcoes/fcs`, fcs);
  }

  // altera all
  alteraAll(fcs: FolhaCorrecaoLista) {
    return this.http.put(`${this.url}/correcoes/fcs`, fcs);
  }

  // altera all
  alteraAllEMovimentos(fcs: FolhaCorrecaoLista) {
    return this.http.put(`${this.url}/correcoes/fcsmovimentos`, fcs);
  }

  verficarFcExisteClienteId(idcliente: number) {
    return this.http.get(`${this.url}/correcoes/fc-existe`);
  }


}//fecha classe
