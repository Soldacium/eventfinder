import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login = true;
  loginmodel = {
    email: '',
    password: ''
  };
  registermodel = {
    email: '',
    pass1: '',
    pass2: '',
    name: ''
  };


  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }



  changeType(){
    this.login = !this.login;
  }

  loginUser(){
    this.authService.login(this.loginmodel.email, this.loginmodel.password);
  }

  registerUser(){
    if (this.registermodel.pass1 === this.registermodel.pass2 && this.registermodel.pass1 !== ''){
      this.authService.createUser(this.registermodel.email, this.registermodel.pass1, this.registermodel.name);
    }

  }

}
