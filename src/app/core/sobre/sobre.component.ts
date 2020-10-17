import { versao } from './../modal/versao';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css']
})
export class SobreComponent implements OnInit {

  versao = versao.version;

  constructor() { }

  ngOnInit() {
  }

}
