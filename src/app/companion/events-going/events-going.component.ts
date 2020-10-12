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
  constructor(private userService: UserService,
    private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getProfileData()
  }

  getProfileData(){
    if(!this.userService.viewedUserData){
      this.userService.viewedUserCollectionsIDsReady.subscribe(ready => {
        this.userSaved = this.eventsService.getSavedEvents(true)
            
      })      
    }else{
      this.userSaved =this.eventsService.getSavedEvents(true)
      console.log(this.userService.viewedUserData)
    }


  }

}
