import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.css']
})
export class InteractionComponent implements OnInit, OnChanges {

  @Input() data: object;
  dataset;

  isWritingResponse = false;

  commentInput = '';
  responseInput = '';

  eventComments = []

  interactionData = {}
  constructor(
    private messageService: MessagesService,
    private authService: AuthService,
    private eventsService: EventsService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(change: SimpleChanges) {
    const newInteractionData = change['data']

    if(newInteractionData.currentValue){
      this.interactionData  = newInteractionData.currentValue;
      console.log(this.interactionData)

      this.eventComments = this.eventsService.getCurrentEvent().comments;
      console.log(this.eventComments)
    }
    
  }

  going(){
    console.log('im going')
  }

  createNewConversation(){
    this.messageService.createNewConversation()
  }

  allMessages(){
    
  }

  postComment(){
    this.eventsService.postComment(this.commentInput)
    console.log(this.commentInput)
    this.commentInput = '';
  }

  postResponse(comment: any){
    console.log(this.responseInput,comment, comment._id);
    const message = this.responseInput;
    if(message !== '' && comment._id){
      
      this.eventsService.postResponse(comment._id, message)
    }
    this.responseInput = '';
  }

  getComments(){

  }

  getMoreComments(){

  }

}
