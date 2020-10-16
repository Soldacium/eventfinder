import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-events-organising',
  templateUrl: './events-organising.component.html',
  styleUrls: ['./events-organising.component.css']
})
export class EventsOrganisingComponent implements OnInit {


  events = [];
  constructor(private eventsService: EventsService) { }

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
    
    
    this.events.forEach((event,i) => {
    });
  }
}
