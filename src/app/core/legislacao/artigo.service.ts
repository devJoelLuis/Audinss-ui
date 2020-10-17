import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Artigo } from '../modal/artigo.class';

@Injectable({
  providedIn: 'root'
})
export class ArtigoService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
  }


 deletarArtigo(id: number) {
   return this.http.delete(`${this.url}/artigos/${id}`);
 }


 deletarArtigoLista(listArtigos: Artigo[]) {
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: listArtigos
  };
    return this.http.delete(`${this.url}/artigos/lista`, httpOptions);
 }



}//fecha classe
