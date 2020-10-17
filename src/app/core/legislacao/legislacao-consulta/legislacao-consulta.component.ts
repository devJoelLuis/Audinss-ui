
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../services/error-handler.service';
import { LegislacaoService } from './../legislacao.service';
import { Legislacao } from '../../modal/legislacao.class';

@Component({
  selector: 'app-legislacao-consulta',
  templateUrl: './legislacao-consulta.component.html',
  styleUrls: ['./legislacao-consulta.component.css']
})
export class LegislacaoConsultaComponent implements OnInit {

  legislacao = new Legislacao();
  legislacoes: Legislacao[] = [];

  load = false;

  constructor(
    private service: LegislacaoService,
    private error: ErrorHandlerService,
    private location: Location,
    private router: Router,
    private confirm: ConfirmationService,
    private message: MessageService,

  ) {
    this.consultarAll();
   }

  ngOnInit() {
  }


  consultarAll() {
    this.load = true;
    this.service.getAll()
        .toPromise()
        .then(ret => {
          this.load = false;
          this.legislacoes = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });
  }

  excluir(leg: Legislacao) {
      this.confirm.confirm({
        message: 'Tem certeza que deseja excluir a legislação '+ leg.legislacao+'?',
        accept: () => {
          this.load = true;
          this.service.deletar(leg.id)
             .toPromise()
             .then(() => {
               this.load = false;
               this.consultarAll();
               this.message.add({ severity: 'info', summary: 'Exclusão', detail: 'A legislação foi excluída com sucesso!' });
             })
             .catch( er => {
               this.load = false;
               this.error.handler(er);
             });
        }
      });
  }


  voltar() {
    this.location.back();
  }


  novaLegislacao() {
    this.router.navigate(['/legislacoes/nova']);
  }

  editar(id: number) {
    this.router.navigate(['/legislacoes', id]);
  }

}//fecha classe
