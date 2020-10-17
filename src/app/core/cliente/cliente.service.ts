import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { Cliente } from './../modal/cliente.class';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }



   //post
   cadastrar(c: Cliente) {
     return this.http.post(`${this.url}/clientes`, c);
   }

   //get id
   getId(id: number) {
     return this.http.get(`${this.url}/clientes/cliente/${id}`);
   }

   //get all param
   getAll(page: number, size: number, param: string) {
    return this.http.get(`${this.url}/clientes?page=${page}&size=${size}&param=${param}`);
   }

   //put
   alterar(c: Cliente) {
    return this.http.put(`${this.url}/clientes`, c);
  }

   //delete
   delete(id: number) {
    return this.http.delete(`${this.url}/clientes/cliente/${id}`);
  }

    //get all param
    getAllDto() {
      return this.http.get(`${this.url}/clientes/clientesdto`);
     }


     //get all user id
     getClientesUser(iduser: number) {
      return this.http.get(`${this.url}/clientes/clientesdto-user/${iduser}`);
    }

     //get all clientes do usuário para o dashboard
     getClientesUserDash() {
      return this.http.get(`${this.url}/clientes/clientesdash`);
    }


}// fecha classe
