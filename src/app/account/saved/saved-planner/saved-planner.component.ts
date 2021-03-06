import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-saved-planner',
  templateUrl: './saved-planner.component.html',
  styleUrls: ['./saved-planner.component.css']
})
export class SavedPlannerComponent implements OnInit {


  
  thisMonthDays = [];
  today;
  thisYear;
  thisMonth;

  activeDay = -1;
  thisMonthFillerDays = {
    before: [],
    after: []
  };


  monthName;
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

  todayEvents = [];
  currentEvent = 0;

  saved = [];
  makeSure = false;

  savedEvents: Array<object>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private eventsService: EventsService) { }



  ngOnInit() {
    this.calendarSetup();
    this.eventsSetup();

  }

  /**
   * EVENT FUNCTIONS
   */

  eventsSetup(){
    this.getSavedEvents();
    this.authService.getUserListener().subscribe(user => {
      //
      this.eventsService.eventsReady.subscribe(ready => {

        if (ready && this.savedEvents === undefined){
          this.getSavedEvents();
        }
      });
    });
  }

  getSavedEvents(){
    const saved = this.eventsService.getSavedEvents();
    if (saved){
      this.savedEvents = this.modifySavedEvents(saved);

    }
  }

  normalizeTime(time: any){
    const start = time.start.split('T');
    const end = time.end.split('T');

    start[0] = start[0].replaceAll('-', '/');
    end[0] = end[0].replaceAll('-', '/');

    const newTime = {
      startDate: start[0],
      startTime: start[1],
      endDate: end[0],
      endTime: end[1],
    };
    return newTime;
  }

  modifySavedEvents(events: Array<object>): Array<object>{
    const modifiedEvents = [];
    events.forEach((savedEvent: any) => {
      let time = JSON.parse(savedEvent.time)

      time = this.normalizeTime(time);
      savedEvent.time = time;

      modifiedEvents.push(savedEvent);
      console.log(time, savedEvent);
    });
    return modifiedEvents;
  }





  /**
   * CALENDAR SETUP & CALENDAR FUNCTIONS
   */
  calendarSetup(){
    this.today = new Date();
    this.thisYear =  this.today.getFullYear();
    this.thisMonth =  this.today.getMonth();
    this.monthName = this.monthNames[this.thisMonth];

    this.thisMonthDays = this.getDaysInMonth(this.thisMonth, this.thisYear);
    this.todayEvents = this.getDayEvents(this.formatDate(this.today));
    this.getMissingDays();


  }

  getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      // for formatting issues, input in ToDo is yyyy-mm-dd while just by getMonth and getDate you can get format yyyy-m-d

      // each day in month have this
      const dayData = {
        date: new Date(date),
        events: this.getDayEvents(this.formatDate(date))
      };

      // push day into array
      days.push(dayData);
      date.setDate(date.getDate() + 1);
    }
    this.thisMonthDays = days;
    return days;
  }

  formatDate(date){
    const month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const day = (date.getDate()  < 10) ? `0${date.getDate() }` : `${date.getDate()}`;
    return `${date.getFullYear()}/${month}/${day}`;
  }

  getDayEvents(date){
    const events = [];
    if (!this.savedEvents){
      return events;
    }
    this.savedEvents.forEach((savedEvent: any) => {

      if (savedEvent.time.startDate === date){
        events.push(savedEvent.title);
      }
    });
    return events;

  }

  nextToDo(){
    if (this.currentEvent < this.todayEvents.length){
      this.currentEvent += 1;
    }
  }

  prevToDo(){
    if (this.currentEvent > 0){
      this.currentEvent -= 1;
    }
  }

  nextMonth(){
    this.thisMonth += 1;
    if (this.thisMonth == 12){
      this.thisMonth = 0;
      this.thisYear += 1;
    }
    this.getDaysInMonth(this.thisMonth, this.thisYear);
    this.getMissingDays();
    this.activeDay = -1;
    this.monthName = this.monthNames[this.thisMonth];
  }

  previousMonth(){
    this.thisMonth -= 1;
    if (this.thisMonth == -1){
      this.thisMonth = 11;
      this.thisYear -= 1;
    }
    this.getDaysInMonth(this.thisMonth, this.thisYear);
    this.getMissingDays();
    this.activeDay = -1;
    this.monthName = this.monthNames[this.thisMonth];
  }

  getMissingDays(){

    this.thisMonthFillerDays.before = [];
    this.thisMonthFillerDays.after = [];
    const first = new Date(this.thisYear, this.thisMonth, 1).getDay();
    const last = new Date(this.thisYear, this.thisMonth + 1, 0).getDay(); // new Date(this.thisYear,this.thisMonth).getDate()

    for (let i = 1; i < first; i++){
      this.thisMonthFillerDays.before.push(i);
    }
    for (let i = last; i < 7; i++){
      this.thisMonthFillerDays.after.push(i + 1);
    }
  }
}
