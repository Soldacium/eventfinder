import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { EventsService } from './services/events.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'eventFinder';

  constructor(
    private authService: AuthService,
    private eventsService: EventsService){}

  ngOnInit(){
    this.authService.autoAuthUser();
    this.eventsService.getEvents();
  }


}
