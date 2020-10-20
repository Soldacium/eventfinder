import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-saved-list',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.css']
})
export class SavedListComponent implements OnInit {

  makeSure = false;
  searchQuery = '';
  inspectedSave;


  savedEvents = [];
  searchedSavedEvents = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private eventsService: EventsService,
    private userService: UserService) { }

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
      console.log(ready)
      this.authService.getUserListener().subscribe(user => {
        console.log(user)
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
    console.log(saved)
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
    this.eventsService.unsaveEvent(save);
    this.userService.deleteSavedEventRef(save._id).subscribe(saved => {
      this.savedEvents = saved;
      this.inspectedSave = undefined;
    });
    this.searchedSavedEvents.splice(this.searchedSavedEvents.indexOf(save),1)
    this.savedEvents.splice(this.savedEvents.indexOf(save),1)
  }
  info(save){

  }

}
