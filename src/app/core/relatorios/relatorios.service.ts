import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


   getRelatorioDemonstrativoAnual(ano: number, clienteid: number, legislacao: string, fimAcumulado: string) {

    return this.http.get(`${this.url}/relatorios/demonstrativo-anual?ano=${ano}&clienteid=${clienteid}&legislacao=${legislacao}&fimAcumulado=${fimAcumulado}`,
         { responseType: 'blob' as 'json'});

 }

 getRelatoriAnexoUnico(ano: number, clienteid: number, legislacao: string, fimAcumulado: string) {

  return this.http.get(`${this.url}/relatorios/anexo-unico?ano=${ano}&clienteid=${clienteid}&legislacao=${legislacao}&fimAcumulado=${fimAcumulado}`,
       { responseType: 'blob' as 'json'});

}



}//fecha classe
