import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { EventsService } from './events.service';

import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  socket;

  constructor(
    private http: HttpClient,
    private eventsService: EventsService, 
    private authService: AuthService,
    private router: Router) {
      this.socket = io('http://localhost:3000/');
      

      this.socket.on('new message',(messageData) => {
        console.log('new message recived')
        this.newMessage.next(messageData)
      })
     }

  allConversations: Array<Conversation>;
  userConversations: Array<Conversation>;
  currentConversation: Conversation;

  conversationsUpdated = new Subject<Conversation[]>();
  newMessage = new Subject();


  setSocket(){

  }

  getAllConversations(){
    return this.allConversations;
  }

  getUserConversations(){
   
    const userID = this.authService.getUserID();
    const conversations = [] 
    /*
    this.allConversations.forEach((Conversation: Conversation) => {
      if(Conversation.userID1 === userID || Conversation.userID2 === userID ){
        conversations.push(Conversation)
      }
    });

    this.userConversations = conversations;
    */
    let params = new HttpParams();
    params = params.append('mode', 'user');
    params = params.append('userID', userID)

    console.log(params)
    this.http
    .get<{userConversations: Conversation[]}>("http://localhost:3000/api/messages/", {params: params})
    .subscribe(response => {
      this.conversationsUpdated.next(response.userConversations)
    })
    return this.userConversations;
  }

  createNewConversation(id1?, id2?){
    const ID1 = this.eventsService.getCurrentEventCreatorID();
    const ID2 = this.authService.getUserID();

    const currentUser = this.authService.getUser();
    const currentEvent = this.eventsService.getCurrentEvent();

    if(ID1 === undefined || ID2 === undefined || currentEvent === undefined || currentUser === undefined){
      return 0;
    }

    if(currentUser.image === undefined || currentUser.image === null){
      currentUser.image = 'assets/icons/general/user.svg';
    }

    const newConvo: Conversation = {
      userID1: ID1,
      userID2: ID2,
      userImg1: currentEvent.iconImg,
      userImg2: currentUser.image,
      userName1: currentEvent.organisator,
      userName2: currentUser.name,
      eventName: currentEvent.title,
      messages: [],
    }

    console.log(newConvo)

    
    this.http
    .post("http://localhost:3000/api/messages/", newConvo)
    .subscribe(newConversation => {
      console.log(newConversation);
      this.router.navigate(['/account/messages'])
    })
    
  }

  joinMessageRoom(room){
    this.socket.emit('join room', room);
    console.log('joined the room' + room)
    
  }

  getConversation(id){
    this.http
    .get("http://localhost:3000/api/messages/" + id)
    .subscribe((res: Conversation) => {
      this.currentConversation = res;
      return res;
    })
  }

  getConversations(){
    this.http
    .get("http://localhost:3000/api/messages/")
    .subscribe(res => {
      console.log(res)
    })
  }

  postMessage(conversationId: string, message: Message){
    const newMessage = message;
    this.http
    .post("http://localhost:3000/api/messages/" + conversationId, newMessage)
    .subscribe((message) => {
      this.socket.emit('new message', newMessage, conversationId)
      console.log(message)
    })
  }
}
