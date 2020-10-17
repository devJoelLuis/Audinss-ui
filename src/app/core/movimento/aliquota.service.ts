import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AliquotaService {

  url='';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
  }


  getAllClienteIdFpAno(idcliente: number, ano: number) {
    return this.http.get(`${this.url}/aliquotas/clientefp?idcliente=${idcliente}&ano=${ano}`);
  }



}// fecha classe
