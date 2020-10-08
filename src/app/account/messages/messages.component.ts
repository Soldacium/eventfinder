import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Conversation } from 'src/app/models/conversation.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';
import { Message } from '../../models/message.model'

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @ViewChild('messageBox') messagesDiv: ElementRef;
  messages: Array<Message> = [];
  message: string;
  messageText: string;

  conversations: Array<Conversation>;
  searchedConversations: Array<Conversation>;
  currentConversation: Conversation;
  currentRoom: string;

  searchQuery = '';

  userID: string;


  constructor(private messagesService: MessagesService, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    //console.log(this.messagesDiv)
    //this.messagesService.getConversations()
    console.log(this.messagesService.userConversations)
    if(!this.messagesService.userConversations){
      this.authService.getUserListener().subscribe(ready => {
        this.userID = this.userService.getCurrentUserID();
        console.log(this.messagesService.userConversations)

        this.messagesService.getUserConversations().subscribe(conversations => {
          console.log(conversations)
          this.conversations = conversations;
          this.searchConversations();
          this.joinMessageRooms();
          console.log(this.conversations)
        });      
      })
    }else{
          this.conversations = this.messagesService.userConversations;
          this.searchConversations();
          this.userID = this.userService.getCurrentUserID();
    }

    //console.log(this.conversations)
    //this.setupConversationsUpdateListener();
    this.setupNewMessageListener()

  }

  ngOnDestroy() {
    //this.leaveMessageRooms()
  }

  sendMessage(message: string){
    const newMessage: Message = {
      date: new Date().toLocaleDateString("en-US"),
      senderID: this.userID,
      message: message,
      //id: ''
    }
    this.messageText = '';
    this.currentConversation.messages.push(newMessage)
    this.messagesDiv.nativeElement.scrollTo(0, this.messagesDiv.nativeElement.scrollHeight + 100);
    
    const convoID = this.currentConversation._id;

    this.messagesService.postMessage(convoID, newMessage)
  }

  setupNewMessageListener(){
    console.log('listening')
    this.messagesService.newMessage.subscribe((messageData: any) => {
      this.messages.push();
      this.conversations.find(x => x._id === messageData.room).messages.push(messageData.message)
    })
  }

  setupConversationsUpdateListener(){
    this.messagesService.conversationsUpdated.subscribe(updatedConversations => {
      this.conversations = [...updatedConversations];
      this.searchConversations();
      this.joinMessageRooms();
      console.log(this.conversations)
    })
  }

  openConversation(conversation){
    this.currentConversation = conversation;
  }

  searchConversations(){
    const searchedConversations = [];
    console.log(this.searchQuery)
    this.conversations.forEach(conversation => {
      if(conversation.conversationName.toLowerCase().includes(this.searchQuery)){
        searchedConversations.push(conversation)
      }
    })

    this.searchedConversations = searchedConversations;
  }

  joinMessageRooms(){
    console.log(this.conversations)
    this.conversations.forEach(conversation => {
      //this.joinMessageRoom(conversation._id)
      this.messagesService.joinMessageRoom(conversation._id);
    })
  }

  joinMessageRoom(room){
    this.messagesService.joinMessageRoom(room);
  }

  leaveMessageRooms(){
    this.conversations.forEach(conversation => {
      //this.joinMessageRoom(conversation._id)
      this.messagesService.leaveMessageRoom(conversation._id);
    })
  }

}
