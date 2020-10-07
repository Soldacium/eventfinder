import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { AuthService } from 'src/app/services/auth.service';
import { Event } from 'src/app/models/event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-your-events',
  templateUrl: './your-events.component.html',
  styleUrls: ['./your-events.component.css']
})
export class YourEventsComponent implements OnInit {

  events = [];
  eventsComments = [];
  eventsCommentsAmounts = [];

  eventsParticipants = [];
  eventsParticipantsAmounts = [];

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
    this.eventsCommentsAmounts = Array(this.events.length);
    this.events.forEach((event,i) => {
      this.eventsComments.push(this.eventsService.getChosenEventComments(event.commentsID).subscribe(res => {
        this.eventsCommentsAmounts[i] = res.length;
      }));
      this.eventsParticipants.push(this.eventsService.getChosenEventParticipants(event.participantsID).subscribe(res => {
        this.eventsParticipantsAmounts[i] = res.length;
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

}
