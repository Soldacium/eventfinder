import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-events-going',
  templateUrl: './events-going.component.html',
  styleUrls: ['./events-going.component.css']
})
export class EventsGoingComponent implements OnInit {

  userSaved;

  searchQuery;
  searchedUserSaved = [];
  constructor(private userService: UserService,
              private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getUserSaved();
  }

  getUserSaved(){
    if (!this.userService.viewedUserData){
      this.userService.viewedUserCollectionsIDsReady.subscribe(ready => {
        this.userSaved = this.eventsService.getSavedEvents(true);
        this.normalizeSaved();
      });
    }else{
      this.userSaved = this.eventsService.getSavedEvents(true);
      this.normalizeSaved();
    }


  }

  normalizeSaved(){

    if (this.userSaved && this.userSaved !== []){
      this.normalizeEventTags();
      this.normalizeEventTimes();
      this.searchSavedEvents();
    }
  }

  normalizeEventTags(){
    this.userSaved.forEach(event => {
      event.tags = JSON.parse(event.tags);
    });
  }

  normalizeEventTimes(){
    this.userSaved.forEach(event => {
      const time = JSON.parse(event.time);
      const start = time.start.split('T');
      const end = time.end.split('T');

      const newTime = {
        startDate: start[0].replaceAll('-', '/'),
        startTime: start[1],
        endDate: end[0].replaceAll('-', '/'),
        endTime: end[1],
      };

      event.time = newTime;
    });

  }

  searchSavedEvents(){
    /*
    this.searchedUserSaved = this.userSaved.filter(event =>
      event.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    */
   console.log(this.userSaved);
   console.log(this.searchedUserSaved);
  }


  findPlace(){

  }

}
