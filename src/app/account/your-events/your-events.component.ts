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

  events;
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


    
    this.eventsService.eventsUpdated.subscribe((events) => {
      this.events = events;
    })
    
  }

  getEvents(){
    this.events = this.eventsService.getUserEvents();
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
