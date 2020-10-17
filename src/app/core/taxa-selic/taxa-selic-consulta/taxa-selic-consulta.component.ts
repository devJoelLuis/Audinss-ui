import { ErrorHandlerService } from './../../services/error-handler.service';
import { TaxaSelicService } from './../taxa-selic.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taxa-selic-consulta',
  templateUrl: './taxa-selic-consulta.component.html',
  styleUrls: ['./taxa-selic-consulta.component.css']
})
export class TaxaSelicConsultaComponent implements OnInit {

  taxas: [] = [];
  load = false;

  constructor(
    private service: TaxaSelicService,
    private error: ErrorHandlerService
  ) {
    this.getAllTaxasDto();
   }

  ngOnInit() {
  }


  getAllTaxasDto() {
     this.load = true;
     this.service.getAllTaxas()
         .toPromise()
         .then( ret => {
           this.load = false;
           this.taxas = ret['dados'];
         })
         .catch( er => {
           this.load = false;
           this.error.handler(er);

         } );
  }

}//fecha classe
