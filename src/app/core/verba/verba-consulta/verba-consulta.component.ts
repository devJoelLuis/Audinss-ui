import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { VerbaService } from './../verba.service';
import { Component, OnInit } from '@angular/core';
import { VerbaPadrao } from './../../modal/verbaPadrao.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verba-consulta',
  templateUrl: './verba-consulta.component.html',
  styleUrls: ['./verba-consulta.component.css']
})
export class VerbaConsultaComponent implements OnInit {

  load = false;
  page = 0;
  size = 20;
  totalPage = 0;

  verbas: VerbaPadrao[] = [];




  constructor(
    private router: Router,
    private service: VerbaService,
    private error: ErrorHandlerService,
    private confirm: ConfirmationService,
    private message: MessageService
  ) {
    this.consultarVerbas();
  }

  ngOnInit() {
  }


  consultarVerbas() {
     this.load = true;
     this.service.getAll()
         .toPromise()
         .then( ret=> {
            this.load = false;
            this.verbas = ret['dados'];
         })
         .catch( er => {
          this.load = false;
          this.error.handler(er);
         });
  }



  cadastrarVerba() {
     this.router.navigate(['/verbas/nova']);
  }

  editarVerba(id: number) {
    this.router.navigate(['/verbas', id]);
  }

  excluirVerba(v: VerbaPadrao) {
     this.confirm.confirm({
       message: 'Tem certeza que deseja excluír a verba '+ v.descricao+'?',
       accept: () => {
         this.load = true;
         this.service.delete(v.id)
             .toPromise()
             .then(()=>{
              this.load = false;
              this.consultarVerbas();
              this.message.add({severity: 'info', summary: 'Verba Excluída', detail: 'A verba foi excluída com sucesso!!!'});
             })
             .catch(er => {
               this.load = false;
               this.error.handler(er);
             })
       }
     });
  }


}//fecha classe
