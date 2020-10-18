import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { EventsService } from './events.service';

import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import * as io from 'socket.io-client';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  socket;

  allConversations: Array<Conversation>;
  userConversations: Array<Conversation>;
  currentConversation: Conversation;

  conversationsUpdated = new Subject<Conversation[]>();
  newMessage = new Subject();

  constructor(
    private http: HttpClient,
    private eventsService: EventsService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService) {
      this.setSocket()
     }




  /* SOCKET */
  setSocket(){
    this.socket = io('http://localhost:3000/');


    this.socket.on('new message', (messageData) => {
      console.log('new message recived');
      this.newMessage.next(messageData);
    });
  }

  joinMessageRoom(room){
    this.socket.emit('join room', room);
    console.log('joined the room' + room);

  }

  leaveMessageRoom(room){
    this.socket.emit('leave room', room);
    console.log('left the room' + room);
  }





  getAllConversations(){
    return this.allConversations;
  }

  getUserConversations(){
    const userID = this.userService.getCurrentUserID();
    const conversations = []

    let params = new HttpParams();
    params = params.append('mode', 'user');
    params = params.append('userID', userID);

    return this.http
    .get<{userConversations: Conversation[]}>('http://localhost:3000/api/messages/', {params})
    .pipe(map((response: any) => {
        this.userConversations = response.userConversations;

        return this.userConversations;
      })
    );
  }

  createNewUserConversation(user1IDs, user2IDs){
    const newConvo: Conversation = {
      userID1: user1IDs.ID,
      userDataID1: user1IDs.dataID,
      userID2: user2IDs.ID,
      userDataID2: user2IDs.dataID,

      conversationName: '',
      nick1: '',
      nick2: '',
      messages: [],
      type: 'user',

      color1: '',
      color2: ''
    };

    this.http
    .post('http://localhost:3000/api/messages/', newConvo)
    .subscribe(newConversation => {
      this.router.navigate(['/account/messages']);
    });
  }

  createNewEventConversation(){
    const ID1 = this.eventsService.getCurrentEventCreatorID();
    const ID2 = this.authService.getUserID();

    const currentUserData = this.userService.getCurrentUserData();
    const currentEvent = this.eventsService.getCurrentEvent();

    if (ID1 === undefined || ID2 === undefined || currentEvent === undefined || currentUserData === undefined){ return 0; }

    if (currentUserData.image === undefined || currentUserData.image === null){ currentUserData.image = 'assets/icons/general/user.svg'; }

    const newConvo: Conversation = {
      userID1: ID1,
      userDataID1: '',
      userID2: ID2,
      userDataID2: this.userService.getCurrentUser().userDataID,

      conversationName: currentEvent.title,
      messages: [],
      type: 'event',
      eventID: currentEvent._id,

      color1: '',
      color2: ''
    };

    this.http
    .post('http://localhost:3000/api/messages/', newConvo)
    .subscribe(newConversation => {
      this.router.navigate(['/account/messages']);
    });
  }

  checkForEventConversation(eventID){
    const userID = this.userService.getCurrentUserID()
    let params = new HttpParams();
    params = params.append('mode', 'check-event');
    params = params.append('userID', userID);
    params = params.append('eventID', this.eventsService.getCurrentEvent()._id);

    return this.http
    .get('http://localhost:3000/api/messages/', {params: params})
    .pipe(map((res: any)=> {
      return res;
    }))
  }

  joinEventGroupConversation(){

  }

  deleteEventGroupConversation(){
    
  }

  getConversation(id){
    this.http
    .get('http://localhost:3000/api/messages/' + id)
    .subscribe((res: Conversation) => {
      this.currentConversation = res;
      return res;
    });
  }

  postMessage(conversationId: string, message: Message){
    const newMessage = message;
    this.http
    .post('http://localhost:3000/api/messages/' + conversationId, newMessage)
    .subscribe((message) => {
      this.socket.emit('new message', newMessage, conversationId);
      console.log(message);
    });
  }
}
