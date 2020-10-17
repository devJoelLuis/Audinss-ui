import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Audinss';


 constructor(
  private router: Router
 ){

 }


 isLogin() {
  if (this.router.url == '/login')
  return true;
  if (this.router.url == '/')
  return true;
  return false;
}



}// fecha classe
