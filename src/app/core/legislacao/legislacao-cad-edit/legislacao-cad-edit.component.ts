import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';


import { Legislacao } from '../../modal/legislacao.class';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { LegislacaoService } from '../legislacao.service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Artigo } from '../../modal/artigo.class';
import { ArtigoService } from '../artigo.service';

@Component({
  selector: 'app-legislacao-cad-edit',
  templateUrl: './legislacao-cad-edit.component.html',
  styleUrls: ['./legislacao-cad-edit.component.css']
})
export class LegislacaoCadEditComponent implements OnInit {

  css= 'container bg-color altura-minima pad';
  titulo = 'Cadastro de Legislação';
  legislacao = new Legislacao();

  load = false;
  edicao = false;
  artigosDeletar: Artigo[] = [];
  nomeArtigo = '';



  constructor(
    private confirm: ConfirmationService,
    private message: MessageService,
    private error: ErrorHandlerService,
    private service: LegislacaoService,
    private location: Location,
    private route: ActivatedRoute,
    private serviceArt: ArtigoService
  ) {

    const idleg = this.route.snapshot.params['id'];
    console.log(idleg);
    if (idleg) {
      this.legislacao = new Legislacao();
      this.legislacao.id = idleg;
      this.modoedicao();
    }

   }



  ngOnInit() {
  }



  salvar() {
   if (!this.legislacao.legislacao) {
     this.message.add({severity: 'warn', summary: 'Erro de Validação',
         detail: 'A descrição da legislação não foi informada!!!', life: 6000});
         return;
   }

   if(this.edicao) {

     if (this.artigosDeletar.length > 0) {
       this.deletarArtigoLista();
     }
     this.load = true;
     this.service.alterar(this.legislacao)
         .toPromise()
         .then(ret => {
           this.load = false;
           this.message.add({ severity: 'success', summary: 'Legislação alterada',
           detail: 'A Legislação foi alterada com sucesso!!' });
           this.goback();
         })
         .catch( er => {
           this.load = false;
           this.error.handler(er);
         });
   } else {
     this.load = true;
     this.service.cadastar(this.legislacao)
         .toPromise()
         .then(() => {
           this.load = false;
           this.legislacao = new Legislacao();
           this.message.add({ severity: 'success', summary: 'Legislação cadastrada',
               detail: 'A Legislação foi cadastrada com sucesso!!' });
         })
         .catch(
           er =>{
            this.load = false;
            this.error.handler(er);
           });
   }


  }//fecha salvar


  modoedicao() {
    this.carregarLegislacaoId();
    this.css= 'container bg-color-edit altura-minima pad';
    this.titulo = 'Edição de Legislação';
    this.edicao = true;
  }



  carregarLegislacaoId() {
    this.load = true;
    this.service.getid(this.legislacao.id)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.legislacao = ret['dados'];
       })
       .catch(er => {
         this.load = false;
         this.error.handler(er);
       });
  }



  excluir(l: Legislacao) {
     this.confirm.confirm({
        message: 'Tem certeza que deseja excluir a legislação '+ l.legislacao+'?',
        accept: () => {
          this.load = true;
          this.service.deletar(l.id)
              .toPromise()
              .then(() => {
                this.load = false;
                this.modoNova();
                this.message.add({ severity: 'info', summary: 'Legislação excluída',
                   detail: 'A legislação foi excluída com sucesso!!' });
              })
              .catch( er => {
                this.load = false;
                this.error.handler(er);
              });
        }
     });
  }



  addArtigo() {
    if (this.nomeArtigo == undefined || this.nomeArtigo == null || this.nomeArtigo.length < 3) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
                detail: 'A descrição do artigo deve conter no mínimo três caracteres!' });
      return;
    }

    var novoArtigo = new Artigo();
    novoArtigo.descricao = this.nomeArtigo;
    //filtra para não deixar repetir os nomes
    this.legislacao.artigos = this.legislacao.artigos.filter( a => {
      return a.descricao != this.nomeArtigo;
    } );
    this.legislacao.artigos.push(novoArtigo);
    this.nomeArtigo = '';

  }//fecha add artigo




  removeArtigo(art: Artigo) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja remover o artigo '+ art.descricao+'?',
      accept: () => {
        if (art.id && art.id > 0) {
          var artigosTemp = this.artigosDeletar.filter( a => {
            return a.id != art.id;
          });
          this.artigosDeletar = artigosTemp;
          this.artigosDeletar.push(art);
        }
        this.legislacao.artigos = this.legislacao.artigos.filter( a => {
           return a.descricao != art.descricao;
        });

      }
    })
  }


  deletarArtigoLista() {
    this.load = true;
    this.serviceArt.deletarArtigoLista(this.artigosDeletar)
       .toPromise()
       .then( ()=> {
         this.load = false;

       })
       .catch(er => {
         this.load = false;
         this.error.handler(er);
       });
  }



  modoNova() {
    this.css= 'container bg-color-novo altura-minima pad';
    this.titulo = 'Cadastro de Legislação';
    this.legislacao = new Legislacao();
    this.edicao = false;
  }


  goback() {
    this.location.back();
  }
}
