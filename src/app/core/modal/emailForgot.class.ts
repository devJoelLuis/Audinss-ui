export class CredenciaisDTO {
  email: string;
  senha: string;
}

export class EmailForgot {

  constructor(email: string) {
     this.email = email;
  }


  email: string;
}
