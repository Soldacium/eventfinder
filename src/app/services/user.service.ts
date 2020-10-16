import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  currentUserInvites;
  currentUserCompanions: UserCompanions;
  private userID;
  private token: string;

  private userListener = new Subject<object>();
  private updatedUserImage = new Subject();

  private savedEventsUpdated = new Subject();

  viewedUser: User;
  viewedUserID: string;
  viewedUserCollectionsIDs: {
    userData: '',
    userFeed: '',
    userCompanions: ''
  };
  viewedUserCollectionsIDsReady = new Subject();
  viewedUserData: UserData;
  viewedUserFeed: UserFeed;
  vievedUserCompanions: UserCompanions;
  viewedUserEvents = [];
  viewedUserSavedEvents = [];
  viewedUserDataUpdated = new Subject();
  viewedUserCompanions = [];

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

  getCurrentUser(): User{
    return this.currentUser;
  }

  getCurrentUserData(): UserData{
    return this.userData;
  }
  getCurrentViewedUserData(): UserData{
    return this.viewedUserData;
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

  clearViewedUser(){
    this.viewedUser = undefined;
    this.viewedUserData = undefined;
    this.viewedUserEvents = undefined;
    this.viewedUserID = undefined;
    this.viewedUserSavedEvents = undefined;
  }

  getViewedUserCollectionsIDs(userID?: string){
    let params = new HttpParams();
    const viewedUserID = userID ? userID : this.viewedUserID;
    params = params.append('mode', 'onlyCollections');
    return this.http.get('http://localhost:3000/api/auth/login/' + userID, {params}).pipe(
      map((res: any) => {

        this.viewedUserCollectionsIDs = res.collectionsIDs;
        this.viewedUserCollectionsIDsReady.next(true);

        return this.viewedUserCollectionsIDs;
      })
    );
  }


  getUserData(ID: string, currentUser?: boolean){
    const userID = (currentUser && this.currentUser) ? this.currentUser.userDataID : ID; //
    if (userID === '' || !userID){return;}

    let params = new HttpParams();
    params = params.append('mode', 'full');
    return this.http.get('http://localhost:3000/api/user-data/' + userID, {params: params}).pipe(
      map((res: any) => {

        if (currentUser){
          this.userData = res.userData;
        }else{
          this.viewedUserData = res.userData;
          this.viewedUserDataUpdated.next(this.viewedUserData);
        }
        // console.log(this.viewedUserData, this.userData, currentUser)
        return res.userData;
      })
    );
  }

  // so you dont store static images and names, but can change whenever user wishes on every post he's been on
  getBasicUserInfo(userDataID){

    let params = new HttpParams();
    params = params.append('mode', 'basic');
    return this.http.get('http://localhost:3000/api/user-data/' + userDataID, {params: params}).pipe(
      map((res: any) => {
        // this.userData.image = res.imageUrl;
        return res.feed;
      })
    );
  }




  getUserFeed(userID: string, yourFeed?: boolean){
    const feedID = yourFeed ? this.currentUser.userFeedID : this.viewedUser.userFeedID;
    return this.http.get('http://localhost:3000/api/user-feed/' + userID).pipe(
      map((res: any) => {
        // this.userData.image = res.imageUrl;
        return res.feed;
      })
    );
  }
  postToUserFeed(userID: string, yourFeed?: boolean){
    const post = this.makePost();
    const feedID = yourFeed ? this.currentUser.userFeedID : this.viewedUser.userFeedID;
    return this.http.post('http://localhost:3000/api/user-feed/' + feedID, post).pipe(
      map((res: any) => {
        // this.userData.image = res.imageUrl;
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

    };
  }



  updateUserData(userProfileData, desc: string){
    const userInfo = this.setUserProfileData(userProfileData);
    userInfo.desc = desc;

    const userDataID = this.currentUser.userDataID;

    return this.http.put('http://localhost:3000/api/user-data/' + userDataID, userInfo).pipe(
      map((res: any) => {
        this.viewedUser = res.user;
        return res.user;
      })
    );
  }

  private setUserProfileData(userProfileData){
    const userInfo = this.userData;
    userInfo.address = userProfileData.address;
    userInfo.website1 = userProfileData.website1;
    userInfo.website2 = userProfileData.website2;
    userInfo.linkedin = userProfileData.linkedin;
    userInfo.facebook = userProfileData.facebook;
    userInfo.twitter = userProfileData.twitter;
    userInfo.instagram = userProfileData.instagram;
    userInfo.email = userProfileData.email;

    userInfo.activities = userProfileData.activities;

    return userInfo;
  }

  updateUserImage(img: File){
    const newImage = new FormData();
    newImage.append('image', img, this.userID);
    newImage.append('mode', 'image');

    const userDataID = this.currentUser.userDataID;

    return this.http.post('http://localhost:3000/api/user-data/' + userDataID , newImage).pipe(
      map((res: any) => {
        this.userData.image = res.imageUrl;
        return this.userData;
      })
    );
  }
  updateUserBackgroundImage(img: File){
    const newImage = new FormData();
    newImage.append('image', img, this.userID);
    newImage.append('mode', 'background-image');

    const userDataID = this.currentUser.userDataID;

    return this.http.post('http://localhost:3000/api/user-data/' + userDataID , newImage).pipe(
      map((res: any) => {
        this.userData.backgroundImage = res.imageUrl;
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
        console.log(userSaved, res);
        return userSaved;
      })
    );
  }
  deleteSavedEventRef(EventID: string){
    const eventIdObj = {eventID: EventID, mode: 'save'};

    const userDataID = this.currentUser.userDataID;
    return this.http.patch('http://localhost:3000/api/user-data/' + userDataID, eventIdObj).pipe(
      map((res: any) => {
        this.userData.saved = this.userData.saved.filter(savedEvent => savedEvent.id !== EventID);

        return this.userData.saved;
      })
    );
  }





  getUserInvites(){
    let params = new HttpParams();
    params = params.append('mode', 'invites');

    const companionsID = this.currentUser.userCompanionsID;
    return this.http.get('http://localhost:3000/api/user-companions/' + companionsID, {params: params})
    .pipe(map((res: any) => {
      this.currentUserInvites = res.data;
      return res.data;
    }))
  }

  addUserCompanion(user){
    const companionsID = this.currentUser.userCompanionsID;
    return this.http.post('http://localhost:3000/api/user-companions/' + companionsID, user).pipe(
      map((res: any) => {
        return res.companions;
      })
    );
  }

  sendUserCompanionInvite(){
    const viewedUserCompanionsID = this.viewedUserCollectionsIDs.userCompanions;
    const currentUserCompanionsID = this.currentUser.userCompanionsID;

    const toInvitedUser = {ID: this.currentUser._id, dataID: this.currentUser.userDataID, companionsID: this.currentUser.userCompanionsID};
    const toInviterUser = {ID: this.viewedUser._id, dataID: this.viewedUser.userDataID, companionsID: this.viewedUser.userCompanionsID};


    this.http.post('http://localhost:3000/api/user-companions/' + viewedUserCompanionsID,{mode: 'add-fromInvite', data: toInvitedUser})

    //return OK status and add to "invited users" array
    return this.http.post('http://localhost:3000/api/user-companions/' + currentUserCompanionsID, {mode: 'add-toInvite', data: toInviterUser })
    .pipe(map((res:any) => {
        return res;
      })
    )
  
  }

  acceptUserCompanionInvite(invateID){
    const viewedUserCompanionsID = this.viewedUserCollectionsIDs.userCompanions;
    const currentUserCompanionsID = this.currentUser.userCompanionsID;

    this.http.patch('http://localhost:3000/api/user-companions/' + viewedUserCompanionsID, {ID: this.currentUser._id, mode: 'accept-toInvite' })
    return this.http.patch('http://localhost:3000/api/user-companions/' + currentUserCompanionsID, {ID: this.viewedUser._id, mode: 'accept-fromInvite'})
    .pipe(map((res:any)=>{
      return res
    }))
  }

  cancelUserCompanionInvite(userID: string){
    const viewedUserCompanionsID = this.viewedUserCollectionsIDs.userCompanions;
    const currentUserCompanionsID = this.currentUser.userCompanionsID;

    let params1 = new HttpParams();
    params1 = params1.append('mode', 'delete-fromInvite');
    params1 = params1.append('inviterID', this.currentUser._id);
    this.http.delete('http://localhost:3000/api/user-companions/' + viewedUserCompanionsID, {params: params1})

    let params2 = new HttpParams();
    params2 = params2.append('mode', 'delete-toInvite');
    params2 = params2.append('invitedID', userID);
    return this.http.delete('http://localhost:3000/api/user-companions/' + viewedUserCompanionsID, {params: params2})
    .pipe(map((res: any)=>{
      console.log(res)
      return res;
    }))

  }

  getCompanion(companionID, currentUser? : boolean){

    const companionsID = currentUser ? this.currentUser.userCompanionsID : this.viewedUserCollectionsIDs.userCompanions;
    let params = new HttpParams();
    params = params.append('mode', 'single');
    params = params.append('userID', companionID)

    return this.http.get('http://localhost:3000/api/user-companions/' + companionsID,{params: params}).pipe(
      map((res: any) => {
        return res.user;
      })
    );
  }


  getUserCompanions(currentUser? : boolean){
    const companionsID = currentUser ? this.currentUser.userCompanionsID : this.viewedUserCollectionsIDs.userCompanions;
    let params = new HttpParams();
    params = params.append('mode', 'all');

    return this.http.get('http://localhost:3000/api/user-companions/' + companionsID,{params: params}).pipe(
      map((res: any) => {
        return res.userCompanions;
      })
    );
  }


  deleteUserCompanion(){

  }

  addUserFollower(){

  }

  deleteUserFollower(){

  }





}
