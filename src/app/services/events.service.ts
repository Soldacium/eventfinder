import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event } from '../models/event.model'
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { MarkerService } from './marker.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  events = [];
  eventsUpdated = new Subject();
  eventsReady = new Subject();

  savedEventsUpdated = new Subject();

  commentsUpdated = new Subject();

  savedEvents = []

  private currentEvent: Event;
  searchedMapMarkersUpdated: any;
  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private markerService: MarkerService) {
      markerService.open.subscribe((event) => {
        this.currentEvent = {...event};
      })
     }


  getCurrentEvent(): Event{
    return this.currentEvent;
  }

  getCurrentEventCreatorID(): string{
    
    return this.currentEvent.userID;
  }


  

  saveEvent(){
    const eventID = {eventID: this.currentEvent._id, mode: 'save'};
    const userID = this.authService.getUserID();

    this.http
    .post('http://localhost:3000/api/auth/signup/' + userID ,eventID)
    .subscribe((res: any) => {
      const userSaved = this.authService.getUser().saved;
      userSaved.push({
        _id: '',
        id: eventID.eventID
      })
      console.log(userSaved)
      this.savedEventsUpdated.next(userSaved)
    })
  }
  unsaveEvent(eventId?:string){
    const eventIdObj = {eventID: '', mode: 'save'};
    const userID = this.authService.getUserID();

    eventId ? eventIdObj.eventID = eventId : eventIdObj.eventID = this.currentEvent._id;

    // using patch as delete
    this.http
    .patch('http://localhost:3000/api/auth/signup/' + userID, eventIdObj)
    .subscribe((res: any) => {
      let userSaved = this.authService.getUser().saved;
      userSaved = userSaved.filter((obj: any) => {
        console.log(obj.id === eventIdObj.eventID)
        return obj.id !== eventIdObj.eventID;
      });
      console.log(userSaved)
      this.savedEventsUpdated.next(userSaved)
    })
  }
  deleteEvent(eventID){
    this.http
    .delete('http://localhost:3000/api/events/' + eventID)
    .subscribe(() => {
      const updatedPosts = this.events.filter(post => post.id !== eventID); //all post but one we're lookin for
      this.events = updatedPosts;
      this.eventsUpdated.next([...this.events])
    });
  }




  getEvents(){
    return this.http.get('http://localhost:3000/api/events/')
    .subscribe((res: any) => {
      console.log(res)
      this.events = res.events;
      this.eventsReady.next(true)
    })
  }
  getUserEvents(){
    const myEvents = [];
    const userID = this.authService.getUserID()
    
    this.events.forEach((event:Event)=> {
      let eventGotten =  {...event}
      if(event.userID == userID){
        const tags = eventGotten.tags.toString()
        eventGotten.tags = JSON.parse(tags)
        myEvents.push(eventGotten)
      }
    })
    console.log(myEvents)

    return myEvents;
  }
  getSavedEvents(){
    const user = this.authService.getUser();
    if(!user){
      return;
    }
    const savedEventsIDs = user.saved;
    const savedEvents = []

    this.events.forEach((event: Event) => {
      savedEventsIDs.forEach((ID:any) => {
        if(event._id == ID.id){
          savedEvents.push({...event})
        }
      })
    })

    this.savedEvents = savedEvents;
    return savedEvents;
  }



  postEvent(event: Event, img: File){

    console.log(img)
    const eventData = this.makePostData(event,img)
    console.log(eventData)
    this.http
    .post("http://localhost:3000/api/events/", eventData)
    .subscribe(res => {
      console.log(res)
    })
  }

  postComment(comment: string ){
    const user = this.authService.getUser();
    const eventID = this.currentEvent._id;

    if(eventID === '' || eventID === undefined || comment === '' || user === undefined){
      return
    }

    const data = {
      newComment: {
        userID: user._id,
        userImg: user.image || 'assets/icons/general/user.svg',
        comment: comment,
        username: user.name || user.email,
        date: new Date().toLocaleString("en-US"),
        responses:[]        
      },
      mode: 'comment'
    }

    this.http
    .post<any>("http://localhost:3000/api/events/" + eventID, data)
    .subscribe(res => {
      this.currentEvent.comments.push(res.data);
      console.log(res.data)
    })
  }

  postResponse(commentID: string, response ){
    const user = this.authService.getUser();
    const eventID = this.currentEvent._id;

    if(eventID === '' || eventID === undefined || response === '' || user === undefined){
      return
    }

    const data = {
      newResponse: {
        userID: user._id,
        userImg: user.image || 'assets/icons/general/user.svg',
        comment: response,
        username: user.name || user.email,
        date: new Date().toLocaleString("en-US"),
        responses:[]        
      },
      mode: 'response',
      commentID: commentID
    }

    this.http
    .post<any>("http://localhost:3000/api/events/" + eventID, data)
    .subscribe(res => {
      this.currentEvent.comments.find(comment => comment._id === commentID).responses.push(res.data)
      console.log(res.data)
    })
  }

  getComments(){
    return this.currentEvent.comments;
  }



  makePostData(event: Event, img: File){
    const postData = new FormData();

    postData.append('title', event.title);
    postData.append('organisator',event.organisator);
    postData.append('type',event.type);
    postData.append('tags',JSON.stringify(event.tags));
    postData.append('time',JSON.stringify(event.time));
    postData.append('address',event.address);
    postData.append('coords',JSON.stringify(event.coords));
    postData.append('price',event.price.toString());
    postData.append('additional',JSON.stringify(event.additional));
    postData.append('desc',event.desc);
    postData.append('plan',JSON.stringify(event.plan));
    postData.append('votes',JSON.stringify(event.votes));
    postData.append('userID',event.userID);

    postData.append('image', img, event.title);

    return postData;
  }
}
