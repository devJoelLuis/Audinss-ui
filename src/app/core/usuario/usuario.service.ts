import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../modal/usuario.class';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url ='';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


   getByEmail(email: string) {
    return this.http.get(`${this.url}/usuarios/email?email=${email}`);
  }

  cadastrar(u: Usuario) {
    return this.http.post(`${this.url}/usuarios`, u);
  }

  alterar(u: Usuario) {
   return this.http.put(`${this.url}/usuarios`, u);
 }

 excluir(id: number) {
   return this.http.delete(`${this.url}/usuarios/${id}`);
 }

 getAll(page: number, size: number, nome: string) {
    if (nome !== '') {
     return this.http.get(`${this.url}/usuarios?page=${page}&size=${size}&nome=${nome}`);
    } else {
     return this.http.get(`${this.url}/usuarios?page=${page}&size=${size}`);
    }
 }

 getById(id: number) {
   return this.http.get(`${this.url}/usuarios/${id}`);
 }



}// fecha classe
