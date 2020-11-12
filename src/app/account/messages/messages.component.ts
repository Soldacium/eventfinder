import { query } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Conversation } from 'src/app/models/conversation.model';
import { ConversationGroup } from 'src/app/models/conversation-group.model';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';
import { Message } from '../../models/message.model';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit {

  @ViewChild('messageBox') messagesDiv: ElementRef;
  messages: Array<Message> = [];
  message: string;
  messageText: string;

  userID: string;
  conversations: Array<Conversation>;
  searchedConversations: Array<Conversation>;
  currentConversation: any;
  conversationsUserInfo = [];
  currentRoom: string;

  contactTypeShown = true;

  searchQuery = '';

  savedEvents = [];

  groupConversations = [];
  searchedGroupConversations = [];


  constructor(
    private messagesService: MessagesService,
    private authService: AuthService,
    private userService: UserService,
    private eventsService: EventsService) { }





  ngOnInit(): void {
    this.loadAllConversaions();
    this.getSavedEvents();
    this.setupNewMessageListener();
  }








  loadAllConversaions(){
    if (!this.messagesService.userConversations){
      if (this.userService.getCurrentUserID()){
        this.getConversations();
      }else{
        this.authService.getUserListener().subscribe(ready => {
          this.getConversations();
        });
      }
    }else{
      this.getReadyConversations();
    }
  }

  getConversations(){
    this.messagesService.getUserConversations().subscribe(conversations => {
      this.userID = this.userService.getCurrentUserID();
      this.conversations = conversations;
      this.searchConversations();
      this.joinMessageRooms();
    });
  }

  getReadyConversations(){
    this.conversations = this.messagesService.userConversations;
    this.searchConversations();
    this.userID = this.userService.getCurrentUserID();
  }




  getSavedEvents(){
    if (!this.userService.getCurrentUserID() && !this.userService.getCurrentUserData()){
      this.userService.currentUserUpdated.subscribe(update => {
        this.userService.getUserData('', true).subscribe(res => {
          this.savedEvents = this.eventsService.getSavedEvents(false);
          this.getEventConversations();
          this.eventsService.eventsReady.subscribe(ready => {
            this.savedEvents = this.eventsService.getSavedEvents(false);
            this.getEventConversations();
          });
        });
      });
    }else if (!this.eventsService.events || this.eventsService.events.length === 0){
      this.eventsService.eventsReady.subscribe(ready => {
        this.savedEvents = this.eventsService.getSavedEvents(false);
        this.getEventConversations();
      });
    }else{
      this.savedEvents = this.eventsService.getSavedEvents(false);
      this.getEventConversations();
    }
  }

  getEventConversations(){
    this.savedEvents.forEach(event => {
      this.messagesService.getEventGroupConversation(event._id).subscribe(res => {
        console.log(res.conversation);
        this.groupConversations.push(res.conversation[0]);
        this.searchGroupConversations();
      });
    });
  }



  joinMessageRooms(){
    this.conversations.forEach(conversation => {
      this.messagesService.joinMessageRoom(conversation._id);
    });
  }

  joinMessageRoom(room){
    this.messagesService.joinMessageRoom(room);
  }

  leaveMessageRooms(){
    this.conversations.forEach(conversation => {
      this.messagesService.leaveMessageRoom(conversation._id);
    });
  }







  /*
  getUserInvitesBasicInfo(){
    this.conversations.forEach(conversation => {
      this.conversationsUserInfo.push(this.getUserBasicInfo(conversation.userDataID1));
    });
  }

  getUserBasicInfo(userDataID){
    return this.userService.getBasicUserInfo(userDataID);
  }
  */




  openConversation(conversation){
    this.currentConversation = conversation;
  }

  sendMessage(message: string, mode: string){
    const newMessage: Message = {
      date: new Date().toLocaleDateString('en-US'),
      senderID: this.userID,
      message,
    };
    this.messageText = '';
    this.currentConversation.messages.push(newMessage);
    this.messagesDiv.nativeElement.scrollTo(0, this.messagesDiv.nativeElement.scrollHeight + 100);

    const convoID = this.currentConversation._id;

    if (mode == 'userMessage'){
      this.messagesService.postMessage(convoID, newMessage);
    }else if (mode == 'groupMessage'){
      this.messagesService.postGroupMessage(convoID, newMessage);
    }
  }

  setupNewMessageListener(){
    console.log('listening');
    this.messagesService.newMessage.subscribe((messageData: any) => {
      this.messages.push();
      this.conversations.find(x => x._id === messageData.room).messages.push(messageData.message);
    });
  }

  setupConversationsUpdateListener(){
    this.messagesService.conversationsUpdated.subscribe(updatedConversations => {
      this.conversations = [...updatedConversations];
      this.searchConversations();
      this.joinMessageRooms();
      console.log(this.conversations);
    });
  }










  searchConversations(){
    const searchedConversations = [];
    this.conversations.forEach(conversation => {
      if (conversation.conversationName.toLowerCase().includes(this.searchQuery)){
        searchedConversations.push(conversation);
      }
    });
    this.searchedConversations = searchedConversations;
  }

  searchGroupConversations(){
    const search = [];
    this.groupConversations.forEach((convo) => {
      console.log(convo);
      if (convo.conversationName.includes(this.searchQuery)){
        search.push(convo);
      }
    });
    this.searchedGroupConversations = search;
  }







}
