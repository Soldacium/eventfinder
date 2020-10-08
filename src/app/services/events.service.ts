import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event } from '../models/event.model';
import { User } from '../models/user.model';
import { UserData } from '../models/userData.model';
import { EventComment } from '../models/event-comments';
import { EventParticipant } from '../models/event-participants';
import { AuthService } from './auth.service';
import { MarkerService } from './marker.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  events = [];
  eventsUpdated = new Subject();
  eventsReady = new Subject();

  savedEventsUpdated = new Subject();

  commentsUpdated = new Subject();
  participantsUpdated = new Subject();

  comments = new Subject();

  savedEvents = [];

  private currentEvent: Event;
  private currentComments: Array<EventComment> = [];
  private currentParticipants: Array<EventParticipant> = [];

  searchedMapMarkersUpdated: any;
  constructor(
    private http: HttpClient,
    private markerService: MarkerService,
    private userService: UserService) {
      markerService.open.subscribe((event) => {
        this.currentEvent = {...event};
      });
     }


  getCurrentEvent(): Event{
    return this.currentEvent;
  }

  getCurrentEventCreatorID(): string{

    return this.currentEvent.userID;
  }





  saveEvent(){
    const eventID = {eventID: this.currentEvent._id, mode: 'save'};
    const participantsID = this.currentEvent.participantsID;
    const userID = this.userService.getCurrentUserID();
    const userData = this.userService.getCurrentUserData();

    /*
    this.http
    .post('http://localhost:3000/api/auth/signup/' + userID , eventID)
    .subscribe((res: any) => {
      userData.saved.push({
        _id: '',
        id: eventID.eventID
      });
      this.savedEventsUpdated.next(userData);
    });
    */

    const participant = { //a.k.a PP
      userID: userID,
      userImg: userData.image || '',
      username: userData.username,
      email: userData.email,
    }


    this.http
    .post('http://localhost:3000/api/event-participants/' + participantsID, participant)
    .subscribe(PP => {
      this.currentParticipants.push(participant)
      this.participantsUpdated.next(this.currentParticipants);
    });
  }


  unsaveEvent(eventId?: string){
    const eventIdObj = {eventID: '', mode: 'save'};
    const userID = this.userService.getCurrentUserID();
    const participantsID = this.currentEvent.participantsID;

    eventId ? eventIdObj.eventID = eventId : eventIdObj.eventID = this.currentEvent._id;

    const userIDobj = { userID: userID }
    this.http
    .patch('http://localhost:3000/api/event-participants/' + participantsID, userIDobj)
    .subscribe(participant => {
      this.currentParticipants = this.currentParticipants.filter(participant => participant.userID !== userID)
      this.participantsUpdated.next(this.currentParticipants);
    });
  }





  getEvents(){
    return this.http.get('http://localhost:3000/api/events/')
    .subscribe((res: any) => {
      console.log(res);
      this.events = res.events;
      this.eventsReady.next(true);
    });
  }
  getUserEvents(){
    const myEvents = [];
    const userID = this.userService.getCurrentUserID();

    this.events.forEach((event: Event) => {
      const eventGotten =  {...event};
      if (event.userID == userID){
        const tags = eventGotten.tags.toString();
        eventGotten.tags = JSON.parse(tags);
        myEvents.push(eventGotten);
      }
    });
    console.log(myEvents);

    return myEvents;
  }
  getSavedEvents(){
    const userData = this.userService.getCurrentUserData();
    if (!userData){
      return;
    }
    const savedEventsIDs = userData.saved;
    const savedEvents = [];

    this.events.forEach((event: Event) => {
      savedEventsIDs.forEach((ID: any) => {
        if (event._id == ID.id){
          savedEvents.push({...event});
        }
      });
    });

    this.savedEvents = savedEvents;
    return savedEvents;
  }





  postEvent(event: Event, img: File){

    let commentsID;
    let participantsID;

    this.http.post<any>('http://localhost:3000/api/event-participants/', '').subscribe(resP => {
      participantsID = resP.data._id;
      this.http.post<any>('http://localhost:3000/api/event-comments/', '').subscribe(resC => {
        commentsID = resC.data._id;
        if (commentsID && participantsID){
          const eventData = this.makePostData(event, img);
          eventData.append('commentsID', commentsID);
          eventData.append('participantsID', participantsID);

          this.http
          .post<{message: string, data: Event}>('http://localhost:3000/api/events/', eventData)
          .subscribe(res => {
            console.log(res);
          });
        }
      });
    });
  }
  deleteEvent(eventID){
    this.http
    .delete('http://localhost:3000/api/events/' + eventID)
    .subscribe(() => {
      const updatedPosts = this.events.filter(post => post.id !== eventID); // all post but one we're lookin for
      this.events = updatedPosts;
      this.eventsUpdated.next([...this.events]);
    });
  }





  postComment(comment: string ){
    const commentsID = this.currentEvent.commentsID;
    const data = this.createCommentData(comment, 'comment');

    if (commentsID === '' || commentsID === undefined || comment === '' || data.newComment.userID === undefined){return; }

    this.http
    .post<any>('http://localhost:3000/api/event-comments/' + commentsID, data)
    .subscribe(res => {
      this.currentComments.push(res.data);
      this.commentsUpdated.next(this.currentComments);
    });
  }
  postResponse( response ,commentID: string){
    const commentsID = this.currentEvent.commentsID;
    const data = this.createCommentData(response, 'response', commentID);

    if (commentsID === '' || commentsID === undefined || response === '' || data.newComment.userID === undefined){ return; }

    console.log(commentID)
    
    this.http
    .post<any>('http://localhost:3000/api/event-comments/' + commentsID, data)
    .subscribe(res => {
      console.log(this.currentComments)
      this.currentComments.find(comment => comment._id === commentID).responses.push(res.data);
      this.commentsUpdated.next(this.currentComments);
    });
  }






  getChosenEventComments(commentsID): Observable<EventComment[]>{
    return this.http.get('http://localhost:3000/api/event-comments/' + commentsID).pipe(
      map((res:any) => { 
        console.log(res.comments.comments)
        return res.comments.comments;
      })
    )
  }
  getChosenEventParticipants(paricipantsID): Observable<EventComment[]>{
    return this.http.get('http://localhost:3000/api/event-participants/' + paricipantsID).pipe(
      map((res:any) => { 
        return res.participants.participants;
      })
    )
  }
  
  getComments(){
    const commentsID = this.currentEvent.commentsID;
    this.http
    .get<{comments: any}>('http://localhost:3000/api/event-comments/' + commentsID)
    .subscribe(res => {
      console.log(res)
      this.currentComments = res.comments.comments;
      this.commentsUpdated.next(this.currentComments);
    });
  }
  getParticipants(){
    const participantsID = this.currentEvent.participantsID;
    this.http
    .get<{participants: any}>('http://localhost:3000/api/event-participants/' + participantsID)
    .subscribe(res => {
      console.log(res)
      this.currentParticipants = res.participants.participants;
      this.participantsUpdated.next(this.currentParticipants);
    });
  }
  
  







  private createCommentData(text: string, mode: string, commentID?:string): any{
    const userData = this.userService.getCurrentUserData();
    
    console.log(userData)
    const data = {
      newComment: {
        userID: userData._id,
        userImg: userData.image || 'assets/icons/general/user.svg',
        comment: text,
        username: userData.username || userData.email,
        date: new Date().toLocaleString('en-US'),
        responses: []
      },
      mode,
      commentID: commentID || ''
    };


    return data;
  }

  private makePostData(event: Event, img: File): FormData{
    const postData = new FormData();

    postData.append('title', event.title);
    postData.append('organisator', event.organisator);
    postData.append('type', event.type);
    postData.append('tags', JSON.stringify(event.tags));
    postData.append('time', JSON.stringify(event.time));
    postData.append('address', event.address);
    postData.append('coords', JSON.stringify(event.coords));
    postData.append('price', event.price.toString());
    postData.append('additional', JSON.stringify(event.additional));
    postData.append('desc', event.desc);
    postData.append('plan', JSON.stringify(event.plan));
    postData.append('userID', event.userID);

    postData.append('website1', event.website1);
    postData.append('website2', event.website2);
    postData.append('phone', event.phone);
    postData.append('email', event.email);

    postData.append('ticketsLink', event.ticketsLink);
    postData.append('image', img, event.title);

    return postData;
  }
}
