import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import jwt_decode from 'jwt-decode';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';



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

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

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
    return this.updatedUserImage.asObservable();
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



  createUser(email: string, password: string, username: string){

    this.createUserDataCollection(email, username).subscribe(userDataID => {
      this.createUserFeedCollection().subscribe(userFeedID => {
        this.createUserCompanionsCollection().subscribe(userCompanionsID => {
          const authData = {email, password, username, userDataID, userFeedID, userCompanionsID};
          this.http
          .post('http://localhost:3000/api/auth/signup', authData)
          .subscribe((res: any) => {
            if (res.message){
              this.login(email, password);
            }
          });
        });
      });
    });
  }

  private createUserDataCollection(email: string, username: string){
    return this.http.post('http://localhost:3000/api/user-data/', {email, username}).pipe(map((userData: any) => {
        return userData.ID;
      })
    );
  }

  private createUserFeedCollection(){
    return this.http.post('http://localhost:3000/api/user-feed/', {}).pipe(map((userFeed: any) => {
        return userFeed.ID;
      })
    );
  }

  private createUserCompanionsCollection(){
    return this.http.post('http://localhost:3000/api/user-companions/', {}).pipe(map((userCollection: any) => {
        return userCollection.ID;
      })
    );
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

        this.userService.setUserID(this.user._id);
        this.userService.setCurrentUser(this.user);
        this.userService.getUserData('', true).subscribe(data => data); ;


        this.saveAuthData(token);
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);

    this.deleteAuthData();
  }




  autoAuthUser(){
    const token = this.getAuthData();
    if (token){
      this.token = token.token;
      this.userID = token.id;
      this.isAuth = true;
      this.authStatusListener.next(true);
    }

    if (this.userID && this.userID !== ''){
      this.http.get<{message: string, userData: any}>('http://localhost:3000/api/auth/login/' + this.userID)
      .subscribe(res => {
        this.user = res.userData;
        this.userService.setUserID(this.user._id);
        this.userService.setCurrentUser(res.userData);
        this.userService.getUserData(this.user._id, true).subscribe(data => data);
        this.userListener.next(this.user);

      });
    }
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
