
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';


import { environment } from '../../../environments/environment';
import { MovimentoList, Movimento } from '../modal/movimento.class';

@Injectable({
  providedIn: 'root'
})
export class MovimentoService {


  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


   getMovimentoClienteAnoMes(ano: number, mes: number, leg: string, idcliente: number) {
      return this.http.get(`${this.url}/movimentos/cliente?ano=${ano}&mes=${mes}&legislacao=${leg}&idcliente=${idcliente}`);
   }

   getMovimentoFpClienteAnoMes(ano: number, mes: number, idcliente: number) {
    return this.http.get(`${this.url}/movimentos/cliente/fp?ano=${ano}&mes=${mes}&idcliente=${idcliente}`);
 }

 getMovimentoAliquotaId(idAliquota: number) {
  return this.http.get(`${this.url}/movimentos/aliquota/${idAliquota}`);
}

   salvaAll(mvs: MovimentoList) {
     return this.http.post(`${this.url}/movimentos/lista`, mvs);
   }

   alteraAll(mvs: MovimentoList) {
    return this.http.put(`${this.url}/movimentos/lista`, mvs);
  }

  getMovimentoFCAliquotaIdAnoMesLegislacao(idaliquota:number, ano: number, mes: number, legislacao: string) {
    return this.http.get(`${this.url}/movimentos/legislacao?idaliquota=${idaliquota}&ano=${ano}&mes=${mes}&legislacao=${legislacao}`);
 }


 getMovimentoClienteIdAnoLegislacao(clienteid:number, ano: number, legislacao: string) {
  return this.http.get(`${this.url}/movimentos/legislacao/cliente?clienteid=${clienteid}&ano=${ano}&legislacao=${legislacao}`);
}


  excluirAll(idAliquota) {
    return this.http.delete(`${this.url}/movimentos/lista/${idAliquota}`);
  }

 alterarUm(m: Movimento) {
   return this.http.put(`${this.url}/movimentos`, m);
 }

 getRelatorio(ano: number, mes: number, idaliquota: number, legislacao: string) {
    return this.http.get(`${this.url}/movimentos/relatoriofc?ano=${ano}&mes=${mes}&idaliquota=${idaliquota}&legislacao=${legislacao}`,
         { responseType: 'blob' as 'json'});

 }

 getAnos(idcliente: number) {
   return this.http.get(`${this.url}/movimentos/anos?clienteid=${idcliente}`);
 }

 getAnosFp(idcliente: number) {
   return this.http.get(`${this.url}/movimentos/anosfp?clienteid=${idcliente}`);
 }

 getLegislacoesDosMovimentosComArtigo() {
   return this.http.get(`${this.url}/movimentos/legislacoes-anexo-unico`);
 }


 getLegislacoesDosMovimentos(idcliente: number) {
  return this.http.get(`${this.url}/movimentos/legislacoes?idcliente=${idcliente}`);
 }


}// fecha classe
