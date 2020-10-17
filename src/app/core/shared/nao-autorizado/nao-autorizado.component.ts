import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nao-autorizado',
  templateUrl: './nao-autorizado.component.html',
  styleUrls: ['./nao-autorizado.component.css']
})
export class NaoAutorizadoComponent implements OnInit {


  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  dash() {
    this.router.navigate(['/dash']);
  }

}
