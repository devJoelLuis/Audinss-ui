import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Legislacao } from '../modal/legislacao.class';

@Injectable({
  providedIn: 'root'
})
export class LegislacaoService {
  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }



   //cadastrar
   cadastar(l: Legislacao) {
       return this.http.post(`${this.url}/legislacoes`, l);
   }

   //alterar
   alterar(l: Legislacao) {
    return this.http.put(`${this.url}/legislacoes`, l);
   }

   //deletar
   deletar(id: number) {
    return this.http.delete(`${this.url}/legislacoes/${id}`);
   }


   //get id
   getid(id: number) {
    return this.http.get(`${this.url}/legislacoes/${id}`);
   }


   //getall
   getAll() {
    return this.http.get(`${this.url}/legislacoes`);
   }

   getAllArtigos() {
    return this.http.get(`${this.url}/legislacoes/artigo`);
   }


}
