import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
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

  eventComments = [];

  interactionData = {};
  constructor(
    private messageService: MessagesService,
    private authService: AuthService,
    private eventsService: EventsService,
    private router: Router) { }

  ngOnInit(): void {
    this.setupCommentsListener();
  }

  setupCommentsListener(){
    this.eventsService.commentsUpdated.subscribe((comments: any) => {
      this.eventComments = comments;
    });
  }

  ngOnChanges(change: SimpleChanges) {
    const newInteractionData = change.data;

    if (newInteractionData.currentValue){
      this.interactionData  = newInteractionData.currentValue;
      console.log(this.interactionData);
      this.eventsService.getComments();
    }
  }

  createNewConversation(){
    this.messageService.createNewConversation();
  }

  postComment(){
    if (this.commentInput !== ''){
      this.eventsService.postComment(this.commentInput);
      this.commentInput = '';
    }
  }

  postResponse(comment: any){
    const message = this.responseInput;
    if (message !== '' && comment._id){
      this.eventsService.postResponse(message, comment._id);
    }
    this.responseInput = '';
  }

  viewCompanion(comment){
    console.log(comment);
    this.router.navigate(['/companion/', comment.userID], { queryParams: { username: comment.username}});
  }




}
