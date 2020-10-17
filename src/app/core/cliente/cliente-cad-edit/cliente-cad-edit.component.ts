
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Ng2ImgMaxService } from 'ng2-img-max';

import { ClienteService } from './../cliente.service';
import { CalendarioBr } from '../../modal/calendarioBr.class';
import { Cliente } from '../../modal/cliente.class';
import { ErrorHandlerService } from './../../services/error-handler.service';

import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-cliente-cad-edit',
  templateUrl: './cliente-cad-edit.component.html',
  styleUrls: ['./cliente-cad-edit.component.css']
})
export class ClienteCadEditComponent implements OnInit {


  css = 'container bg-color-novo altura-minima pad';
  titulo = 'Cadastro de novo Cliente';
  cliente = new Cliente();
  edicao = false;
  load=false;

  br = new CalendarioBr();

  imgSelecionado: File = null;
  imagePreviewImg: any = '';
  img_height = 400;
  img_whidth = 800;

  constructor(
    private location: Location,
    private ng2Img: Ng2ImgMaxService,
    public sanitizer: DomSanitizer,
    private message: MessageService,
    private erroHandle: ErrorHandlerService,
    private service: ClienteService,
    private route: ActivatedRoute,
  ) {

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.edicao = true;
      this.css = 'container bg-color-edit altura-minima pad';
      this.titulo = 'Edição de Cliente';
      this.carregarCliente(id);
    }

  }



  ngOnInit() {
  }




  carregarCliente(id: number) {
    this.load = true;
    this.service.getId(id)
        .toPromise()
        .then( ret => {
          console.log(ret);
          this.load = false;
          this.cliente = ret['dados'];
          this.cliente.inicio = new Date(`${this.cliente.inicio} 00:00:00 GMT-0300`);
          this.cliente.fim = new Date(`${this.cliente.fim} 00:00:00 GMT-0300`);
          this.imagePreviewImg = this.cliente.logotipo;
         // console.log(this.cliente);
        })
        .catch( er => {
          this.load = false;
          this.erroHandle.handler(er);
        })
  }







  onSubmit(f) {
    console.log(f);
    if (!f.valid) {
      this.message.add({severity: 'warn', summary: 'Erro de Validação',
          detail: 'Ocorreu um erro de validação, preencha todos os campos com * asterisco'});
      return;
    }

    // verificar se data inicio é maio que data fim
    if (this.cliente.inicio.getTime() > this.cliente.fim.getTime()) {
      this.message.add({severity: 'warn', summary: 'Erro de Validação',
          detail: 'A data início não pode ser maior que a data fim', life: 6000});
      return;
    }

    this.cliente.logotipo = this.imagePreviewImg;
     this.cliente.nome = this.cliente.nome.toUpperCase()
    if (this.cliente.rua)
    this.cliente.rua = this.cliente.rua.toLocaleUpperCase();
    if (this.cliente.bairro)
    this.cliente.bairro = this.cliente.bairro.toLocaleUpperCase();
    if (this.cliente.cidade)
    this.cliente.cidade = this.cliente.cidade.toLocaleUpperCase();
    if (this.cliente.estado)
    this.cliente.estado = this.cliente.estado.toLocaleUpperCase();
    if (this.cliente.email)
    this.cliente.email = this.cliente.email.toLocaleLowerCase();


    //verificar se é novo ou edicao
    if (this.edicao) {
      this.load = true;
      this.service.alterar(this.cliente)
          .subscribe(() => {
            this.load = false;
            this.message.add({ severity: 'success', summary: 'Alterações salvas',
                   detail: 'Cliente alterado com sucesso!!!' });
           this.goback();
          }, er => {
            this.load = false;
            this.erroHandle.handler(er);
          });
    } else {
      this.load = true;
      this.service.cadastrar(this.cliente)
          .subscribe(() => {
            this.cliente = new Cliente();
            this.limparImagem();
            this.limparForm(f);
            this.load = false;
            this.message.add({ severity: 'success', summary: 'Cliente Cadastrado',
                   detail: 'Cliente cadastrado com sucesso!!!' });
            this.cliente.inicio = new Date();
            this.cliente.fim = new Date();
          }, er => {
            this.load = false;
            this.erroHandle.handler(er);
          });
    }
  }




  goback() {
    this.location.back();
  }




  limparForm(f) {
    this.cliente = new Cliente();
    f.reset();
  }



  // manipulação imagem
  arquivoSelecionado(files: FileList) {
    if (files) {
    if (files.item(0).type == 'image/jpeg') {
      this.imagePreviewImg = '';
      if (files.item(0).size > 1000) {
        var imgTemp = files.item(0);
        this.imgSelecionado = null;
        this.ng2Img.resizeImage(imgTemp, this.img_whidth,
          this.img_height).subscribe(result => {
            this.imgSelecionado = new File([result], result.name);
            // exibir img produto e adicionar no slot;
            this.getImagePreviewImg(this.imgSelecionado);
          }, error => {
            this.erroHandle.handler(error);
          });
      } else {
        this.imgSelecionado = files.item(0);
        this.getImagePreviewImg(this.imgSelecionado);
      }
    } else {
      this.message.add({severity: 'warn', summary: 'Formato desconhecido',
              detail: 'O sistema só aceita imagens no formato jpg!!!', life: 4000});
      this.limparImagem();
    }
   }
  }



  getImagePreviewImg(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreviewImg = reader.result;
      this.imagePreviewImg = this.imagePreviewImg.replace('data:;base64', 'data:image/jpeg;base64');

    };
  }



  limparImagem() {
  this.imgSelecionado = null;
  this.imagePreviewImg = '';
  }



}// fecha classe
