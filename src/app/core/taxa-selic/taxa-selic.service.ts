import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxaSelicService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }



   getAllTaxas() {
     return this.http.get(`${this.url}/taxas-selic`);
   }


}//fecha classe
