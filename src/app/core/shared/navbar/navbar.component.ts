import { Router } from '@angular/router';
import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  usuarioLogado = '';

  constructor(
    public auth: AuthService,
    private router: Router
  ) {

       this.usuarioLogado = this.auth.jwtPayload['nome'];

   }


   perfilUsuario() {
    const email = this.auth.jwtPayload['user_name'];
    this.router.navigate([`/usuarios/perfil/${email}`]);
   }



  logout() {
    this.auth.logout();
  }

}// fecha classe
