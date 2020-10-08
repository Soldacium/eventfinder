import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User } from '../models/user.model';
import { UserData } from '../models/userData.model';
import { UserCompanions } from '../models/userCompanions.model';
import { UserFeed } from '../models/userFeed.model';
import { EventsService } from './events.service';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User;
  private userData: UserData;
  private currentUserData: UserData;
  private userID;
  private token: string;


  private userListener = new Subject<object>();
  private updatedUserImage = new Subject();

  private savedEventsUpdated = new Subject();

  viewedUser: User;
  viewedUserID: string;
  viewedUserData: UserData;
  viewedUserFeed: UserFeed;
  vievedUserCompanions: UserCompanions;
  viewedUserEvents = [];
  viewedUserSavedEvents = [];
  viewedUserUpdated = new Subject();

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getToken(){
    return this.token;
  }

  getCurrentUserID(): string{
    return this.userID;
  }

  setUserID(ID){
    this.userID = ID;
  }

  setCurrentUser(user){
    this.currentUser = user;
  }

  getCurrentUserData(): UserData{
    return this.userData;
  }

  getUserImageListener() {
    return this.updatedUserImage.asObservable();
  }

  getUserListener() {
    return this.userListener.asObservable();
  }

  getViewedUserID() {
    return this.viewedUserID;
  }

  navigateToChosenUser(userID: string, username: string){
    this.viewedUserID = userID;
    this.router.navigate(['/post', username],  { queryParams: { userID }});
  }


  getUserData(ID: string, currentUser?: boolean){  
    const userID = (currentUser && this.currentUser) ? this.currentUser.userDataID : ID;
    if(userID === '' || !userID){return}

    return this.http.get('http://localhost:3000/api/user-data/' + userID).pipe(
      map((res: any) => {
        this.viewedUserData = res.userData;
        if (currentUser){
          console.log(res.userData)
          this.userData = res.userData;
        }
        
        return res.userData;
      })
    );
  }




  getUserFeed(userID: string, yourFeed?:boolean){
    const feedID = yourFeed ? this.currentUser.userFeedID : this.viewedUser.userFeedID;
    return this.http.get('http://localhost:3000/api/user-feed/' + userID).pipe(
      map((res: any) => {
        //this.userData.image = res.imageUrl;
        return res.feed;
      })
    );
  }
  postToUserFeed(userID: string, yourFeed?:boolean){
    const post = this.makePost();
    const feedID = yourFeed ? this.currentUser.userFeedID : this.viewedUser.userFeedID;
    return this.http.post('http://localhost:3000/api/user-feed/' + feedID, post).pipe(
      map((res: any) => {
        //this.userData.image = res.imageUrl;
        return res.post;
      })
    );
  }
  commentOnUserFeed(userID: string, comment){

  }
  respondToCommentOnUserFeed(userID: string, comment){

  }

  private makePost(){
    return {

    }
  }



  updateUserData(name: string, phone?: string, address?: string, website?: string, desc?: string){
    const userInfo = this.userData;

    phone ? userInfo.phone = phone : '';
    address ? userInfo.address = address : '';
    desc ? userInfo.desc = desc : '';
    website ? userInfo.website1 = website : '';

    const userDataID = this.currentUser.userDataID;

    return this.http.put('http://localhost:3000/api/user-data/' + userDataID, userInfo).pipe(
      map((res: any) => {
        this.viewedUser = res.user;
        return res.user;
      })
    );
  }

  updateUserImage(img: File){
    const newImage = new FormData();

    newImage.append('image', img, this.userID);
    newImage.append('mode', 'image');

    const userDataID = this.currentUser.userDataID;

    return this.http.post('http://localhost:3000/api/user-data/' + userDataID , newImage).pipe(
      map((res: any) => {
        console.log(res)
        this.userData.image = res.imageUrl;
        return this.userData;
      })
    );
  }



  addSavedEventRef(EventID: string){
    
    const eventID = {eventID: EventID, mode: 'save'};

    const userData = this.userData;
    const userDataID = this.currentUser.userDataID;

    return this.http.post('http://localhost:3000/api/user-data/' + userDataID, eventID).pipe(
      map((res: any) => {
        const userSaved = userData.saved;
        userSaved.push({
          _id: '',
          id: eventID.eventID
        });
        console.log(userSaved, res)
        return userSaved;
      })
    );
  }
  deleteSavedEventRef(EventID: string){
    const eventIdObj = {eventID: EventID, mode: 'save'};

    const userDataID = this.currentUser.userDataID;
    // using patch as delete
    return this.http.patch('http://localhost:3000/api/user-data/' + userDataID, eventIdObj).pipe(
      map((res: any) => {

        this.userData.saved = this.userData.saved.filter(savedEvent => savedEvent.id !== EventID)

        return this.userData.saved;
      })
    );
  }



  getUserCompanions(userID: string){
    const companionsID = this.viewedUser.userCompanionsID;
    return this.http.get('http://localhost:3000/api/user-companions/' + companionsID).pipe(
      map((res: any) => {
        return res.companions;
      })
    );
  }
  addUserCompanion(){

  }
  deleteUserCompanion(){

  }

  addUserFollower(){

  }

  deleteUserFollower(){

  }





}
