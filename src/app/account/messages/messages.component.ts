import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Conversation } from 'src/app/models/conversation.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Message } from '../../models/message.model'

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

  conversations: Array<Conversation>;
  searchedConversations: Array<Conversation>;
  currentConversation: Conversation;
  currentRoom: string;

  searchQuery = '';

  userID: string;


  constructor(private messagesService: MessagesService, private authService: AuthService) { }

  ngOnInit(): void {
    console.log(this.messagesDiv)
    //this.messagesService.getConversations()
    this.conversations = this.messagesService.getUserConversations();
    this.setupConversationsUpdateListener();
    this.setupNewMessageListener()
    this.userID = this.authService.getUserID();

    

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
      if(conversation.eventName.toLowerCase().includes(this.searchQuery)){
        searchedConversations.push(conversation)
      }
    })

    this.searchedConversations = searchedConversations;
  }

  joinMessageRooms(){
    this.conversations.forEach(conversation => {
      this.joinMessageRoom(conversation._id)
    })
  }

  joinMessageRoom(room){
    this.messagesService.joinMessageRoom(room);
  }

}
