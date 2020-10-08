import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { AuthService } from 'src/app/services/auth.service';
import { Event } from 'src/app/models/event.model';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-your-events',
  templateUrl: './your-events.component.html',
  styleUrls: ['./your-events.component.css']
})
export class YourEventsComponent implements OnInit {

  events = [];
  eventsComments = [];
  eventsCommentsReady = [];

  eventsParticipants = [];
  eventsParticipantsReady = [];

  showedComments = [];
  showedParticipants = [];

  constructor(
    private eventsService: EventsService,
    private router: Router) { }

  ngOnInit(): void {
    this.getEvents()
    

    this.eventsService.eventsReady.subscribe(ready => {
      if(ready){
        this.getEvents()
        console.log(this.events)
      }
    })

    this.eventsService.eventsUpdated.subscribe((events: any) => {
      this.events = events;
    })
    
  }

  getEvents(){
    this.events = this.eventsService.getUserEvents();
    this.eventsCommentsReady = new Array(this.events.length).fill([]);
    this.eventsParticipantsReady = new Array(this.events.length).fill([]);
    this.events.forEach((event,i) => {
      this.eventsComments.push(this.eventsService.getChosenEventComments(event.commentsID).subscribe(res => {
        this.eventsCommentsReady[i] = res;
      }));
      this.eventsParticipants.push(this.eventsService.getChosenEventParticipants(event.participantsID).subscribe(res => {
        this.eventsParticipantsReady[i] = res;
      }));
    });
  }

  edit(event){

  }
  delete(event){
    this.eventsService.deleteEvent(event._id)
  }
  navigate(){}

  navigateNewEvent(){
    this.router.navigate(['/account/new-event'])
  }

  showParticipants(index: number){
    //this.showedParticipants[index].subscibe(res => this.showedParticipants = res);
    //this.showedParticipants = [...this.showedParticipants[index]];

    this.showedParticipants = this.eventsParticipantsReady[index];
    console.log(this.showedParticipants);
  }

  showComments(index:number){
    //console.log(this.eventsComments, index)
    //this.eventsComments[index].pipe(map(res => console.log(res)))
    //this.showedComments[index].subscibe(res => this.showedComments = res);

    this.showedComments = this.eventsCommentsReady[index];
    console.log(this.showedComments);
  }

  cancelOverlay(){
    this.showedComments = [];
    this.showedParticipants = [];
  }

}
