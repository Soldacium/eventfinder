import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subject, VirtualTimeScheduler } from 'rxjs';
import { Event } from 'src/app/models/event.model';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.css']
})
export class MainInfoComponent implements OnInit, OnChanges {

  tags = [];
  @Output() closeInfo: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('data') data: any;
  @Input('saved') saved: Array<Object>;

  currentEvent;
  savedEvents;
  thisEventIsSaved: boolean;

  infoHidden = false;

  section1: object;
  section2: object;
  section3: object;
  section4: object;


  sectionDatasets = {
    section1: {},
    section2: {},
    section3: {},
    section4: {}
  };




  constructor(private eventsService: EventsService,
              private userService: UserService) { }

  ngOnInit(): void { }






  ngOnChanges(changes: SimpleChanges) {
    const eventDataChange = changes.data;
    const userSavedEventsChange = changes.saved;

    if (this.data && eventDataChange){

      this.currentEvent = eventDataChange.currentValue;
      this.updateGeneral();
      this.updateDesc();
      this.updatePlan();
      this.updateInteraction();

      this.updateSaveButton();
      this.infoHidden = false;
    }

    if (this.saved && userSavedEventsChange){
      this.savedEvents = userSavedEventsChange.currentValue;
      this.updateSaveButton();
    }
  }

  updateGeneral(){
    this.section1 = {
      title: this.currentEvent.title,
      organisator: this.currentEvent.organisator,
      image: this.currentEvent.iconImg,
      type: this.currentEvent.type,
      place: this.currentEvent.address,
      tags:  this.currentEvent.tags,
      time: this.currentEvent.time,
      price: this.currentEvent.price,
      req: this.currentEvent.additional
    };
  }
  updateDesc(){
    this.section2 = this.currentEvent.desc;
  }
  updatePlan(){
    this.section3  = this.currentEvent.plan;
  }
  updateInteraction(){
    this.section4 = {
      orgID: this.currentEvent.userID,
      votes: this.currentEvent.votes
    };
  }




  updateSaveButton(){
    this.thisEventIsSaved = false;
    if (this.currentEvent && this.savedEvents){
      this.savedEvents.forEach((save: any) => {
        if (save.id === this.currentEvent._id){
          this.thisEventIsSaved = true;
        }
      });
    }
  }

  saveEvent(){
    this.eventsService.saveEvent();
    this.userService.addSavedEventRef(this.currentEvent._id).subscribe(saved => {
      this.savedEvents = saved;
      this.updateSaveButton();
    });
  }

  unsaveEvent(){
    this.eventsService.unsaveEvent();
    this.userService.deleteSavedEventRef(this.currentEvent._id).subscribe(saved => {
      this.savedEvents = saved;
      this.updateSaveButton();
    });
  }




  close(){
    this.infoHidden = true;
    this.closeInfo.emit(true);
  }




}
