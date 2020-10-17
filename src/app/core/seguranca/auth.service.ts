import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ErrorHandlerService } from './../services/error-handler.service';
import { EmailForgot } from '../modal/emailForgot.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  private url = '';
  private jwtHelper = new JwtHelperService();
  jwtPayload: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private erroHandle: ErrorHandlerService,
    private message: MessageService
  ) {
    this.url = environment.apiUrl;
    this.carregarToken();
   }



 login(usuario: string, senha: string): Promise<void> {

   const headers = new HttpHeaders()
   .append('Content-Type', 'application/x-www-form-urlencoded')
   .append('Authorization', 'Basic YW5ndWxhcjo5NjI4OTYyOA=='); //Basic YW5ndWxhcjo5NjI4OTYyOA==
   const body = `grant_type=password&username=${ usuario}&password=${senha}`;

   return this.http.post(`${this.url}/oauth/token`, body, { headers, withCredentials: true } )
        .toPromise()
        .then( ret => {
          this.armazenarToken(ret['access_token']);
          this.router.navigate(['/dash']);
          return Promise.resolve(null);
        })
        .catch( er => {
           this.erroHandle.handler(er);
           this.router.navigate(['/']);
           return Promise.resolve(null);
        });
 }






 obterNovoAccessToken(): Promise<void> {

  const headers = new HttpHeaders()
   .append('Content-Type', 'application/x-www-form-urlencoded')
   .append('Authorization', 'Basic YW5ndWxhcjo5NjI4OTYyOA==');
   const body = 'grant_type=refresh_token';

   return this.http.post<any>(`${this.url}/oauth/token`, body,
       { headers, withCredentials: true })
     .toPromise()
     .then(response => {
       this.armazenarToken(response['access_token']);

       console.log('Novo access token criado!');

       return Promise.resolve(null);
     })
     .catch(response => {
       console.error('Erro ao renovar token.', response);
       return Promise.resolve(null);
     });

 }



 logout() {
    this.http.delete(`${this.url}/tokens/revoke`, { withCredentials: true })
        .toPromise()
        .then(() => {
          localStorage.removeItem('token');
          this.jwtPayload = null;
          this.router.navigate(['/']);
        })
        .catch( () => {
          this.message.add({ severity: 'error', summary:'Erro de logout',
               detail: 'Ocorreu um erro e não foi possível fazer o logout', life: 4000 })
        });
 }

 temPermissao(permissao: string) {
   return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
 }

 temQualquerPermissao(roles: any) {
  for (const role of roles) {
    if (this.temPermissao(role)) {
      return true;
    }
  }

  return false;
}

temToken() {
  return localStorage.getItem('token') ? true : false;
}

 isAccessTokenInvalido() {
   const token = localStorage.getItem('token');
   return !token || this.jwtHelper.isTokenExpired(token);
 }


 private armazenarToken(token: string) {
   this.jwtPayload = this.jwtHelper.decodeToken(token);
   localStorage.setItem('token', token);
 }

 private carregarToken() {
   const token = localStorage.getItem('token');
   if (token) {
     this.armazenarToken(token);
   }
 }

 esqueceSenha(email: string) {
  const emailf = new EmailForgot(email);
  return this.http.post(`${this.url}/auth/forgot`, emailf);
}


}// fecha classe
