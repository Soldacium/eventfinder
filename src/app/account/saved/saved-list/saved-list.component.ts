import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-saved-list',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.css']
})
export class SavedListComponent implements OnInit {

  makeSure = false;
  searchQuery = '';


  savedEvents = [];
  searchedSavedEvents = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getSavedEvents();

    this.setupSavedEventsReadyListener();
    this.setupSavedEventsUpdateListener();

  }

  setupSavedEventsUpdateListener(){
    this.eventsService.savedEventsUpdated.subscribe((savedEvents: any) => {
      this.savedEvents = [...savedEvents];
    });
  }

  setupSavedEventsReadyListener(){
    this.eventsService.eventsReady.subscribe(ready => {
      this.getSavedEvents()
      this.authService.getUserListener().subscribe(user => {
        if(ready && (this.savedEvents === undefined || this.savedEvents === [])){
          this.getSavedEvents();
        }
      });
    });
  }

  getSavedEvents(){
    const saved = this.eventsService.getSavedEvents();
    if (saved && saved !== []){
      this.savedEvents = saved;
      this.normalizeEventTags();
      this.normalizeEventTimes();
      this.searchSavedEvents();
    }
  }

  normalizeEventTags(){
    this.savedEvents.forEach(event => {
      event.tags = JSON.parse(event.tags)
    });
  }

  normalizeEventTimes(){
    this.savedEvents.forEach(event => {
      let time = JSON.parse(event.time);
      const start = time.start.split('T');
      const end = time.end.split('T');

      const newTime = {
        startDate: start[0].replaceAll('-','/'),
        startTime: start[1],
        endDate: end[0].replaceAll('-','/'),
        endTime: end[1],
      }

      event.time = newTime;
    });

  }

  searchSavedEvents(){
    this.searchedSavedEvents = this.savedEvents.filter(event => 
      event.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log(this.searchedSavedEvents)
  }

  going(save){

  }
  comments(save){

  }
  delete(save){
    this.eventsService.unsaveEvent(save._id);
  }
  info(save){

  }

}
