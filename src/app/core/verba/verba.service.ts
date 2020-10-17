import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { VerbaPadrao } from './../modal/verbaPadrao.class';

@Injectable({
  providedIn: 'root'
})
export class VerbaService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
     this.url = environment.apiUrl;
   }


   cadastrar(v: VerbaPadrao) {
     return this.http.post(`${this.url}/verbas`, v);
   }

   alterar(v: VerbaPadrao) {
    return this.http.put(`${this.url}/verbas`, v);
   }

   alterarVerbaMovimentos(v: VerbaPadrao) {
    return this.http.put(`${this.url}/verbas/movimentos`, v);
   }


   delete(id: number) {
     return this.http.delete(`${this.url}/verbas/${id}`);
   }

   getId(id: number) {
    return this.http.get(`${this.url}/verbas/verba/${id}`);
   }

   getAll() {
    return this.http.get(`${this.url}/verbas`);
   }

   getAllClienteId(id: number) {
    return this.http.get(`${this.url}/verbas/cliente/${id}`);
   }




}//fecha classe
