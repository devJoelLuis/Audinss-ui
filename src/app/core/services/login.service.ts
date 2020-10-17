import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private router: Router,
    private message: MessageService
  ) { }


  login(login:string, senha:string) {

  }


}// fecha classe
