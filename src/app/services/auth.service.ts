import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import jwt_decode from 'jwt-decode';
import { User } from '../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User;
  private userID;
  private token: string;
  private isAuth = false;
  private authStatusListener = new Subject<boolean>();
  private userListener = new Subject<object>();
  private updatedUserImage = new Subject();

  constructor(private http: HttpClient, private router: Router) { }

  getToken(){
    return this.token;
  }

  getUserID(): string{
    return this.userID;
  }

  getUser(): User{
    return this.user;
  }

  getUserImageListener() {
    return this.updatedUserImage.asObservable()
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserListener() {
    return this.userListener.asObservable();
  }

  getAuthStatus(){
    return this.isAuth;
  }

  createUser(email: string, password: string, name: string){
    const authData = {email, password, name};
    this.http
    .post('http://localhost:3000/api/auth/signup', authData)
    .subscribe((res: any) => {
      if (res.message){
        this.login(email, password);
      }
    });
  }

  login(email: string, password: string) {
    const authData = {email, password};

    this.http
    .post<{token: string, userID: string, userData: any}>('http://localhost:3000/api/auth/login', authData)
    .subscribe(res => {
      const token = res.token;
      this.token = token;
      if (token) {
        this.authStatusListener.next(true);
        this.isAuth = true;
        this.user = res.userData;
        

        this.saveAuthData(token);
        this.router.navigate(['/']);
      }
    });
  }

  changeAccInfo(name: string, phone?: string, address?: string,website?:string, desc?: string){

    const userInfo = this.user;
    const userID = this.userID;

    phone ? userInfo.phone = phone : '';
    address ? userInfo.address = address : '';
    desc ? userInfo.desc = desc : '';
    website ? userInfo.website1 = website : '';

    this.http.put('http://localhost:3000/api/auth/signup/' + userID, userInfo)
    .subscribe(res => {
      console.log(res);
      
    });
  }

  changeAccImage(img: File){
    const newImage = new FormData();

    console.log(img)
    newImage.append('image', img, this.userID);
    newImage.append('mode', 'image')

    this.http
    .post<{imageUrl: string}>("http://localhost:3000/api/auth/signup/" + this.userID, newImage)
    .subscribe(res => {
      const newImageUrl = res.imageUrl;
      console.log(res, newImageUrl)
      this.updatedUserImage.next(newImageUrl)
    })
  }

  autoAuthUser(){
    const token = this.getAuthData();
    if (token){
      this.token = token.token;
      this.userID = token.id;
      this.isAuth = true;
      this.authStatusListener.next(true)
    }

    if (this.userID && this.userID !== ''){
      this.http.get<{message: string, userData: any}>('http://localhost:3000/api/auth/login/' + this.userID)
      .subscribe(res => {
        this.user = res.userData;
        this.userListener.next(this.user);
      });
    }
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);

    this.deleteAuthData();
  }

  private saveAuthData(token: string){
    const decoded = jwt_decode(this.token);
    localStorage.setItem('token', token);
    localStorage.setItem('id', decoded.userId);
  }
  private deleteAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
  }
  private getAuthData(){
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if (!token){
      return;
    }
    return {token, id};
  }
}
