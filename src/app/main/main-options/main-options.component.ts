import { Component, OnInit } from '@angular/core';
import { MarkerService } from 'src/app/services/marker.service';

@Component({
  selector: 'app-main-options',
  templateUrl: './main-options.component.html',
  styleUrls: ['./main-options.component.css']
})
export class MainOptionsComponent implements OnInit {

  eventTypes = ['Party', 'Meeting', 'Concert', 'Happening', 'Opening', ];
  eventTags = [
    'Huge place', 'Small place', 'Free drinks', 'Charity',
    'Dancing', 'Drinking', 'Gastronomy', 'Open space',
    'Closed space', 'Sponsored', 'Pay-as-you-go', 'Need invite',
    'Science', 'Culture', 'Religion', 'Sport', 'Weird', 'Innovative' ];

  chosenTags = [];
  chosenType = '';

  options = {
    name: '',
    organisator: '',
    type: '',
    tags: [],
    start: '',
    end: '',
    maxPrice: 1000
  };




  constructor(
    private markerService: MarkerService,
    ) { }

  ngOnInit(): void {
  }




  /* types and tags */
  pickType(type){
    this.chosenType === type ? this.chosenType = '' : this.chosenType = type;
  }
  pickTag(tag) {
    const isTag = this.chosenTags.includes(tag);
    if (isTag == false) {
      this.chosenTags.push(tag);
    } else {
      this.chosenTags.splice(this.chosenTags.indexOf(tag), 1);
    }
  }





  search(){

    this.modifySearchOptions();
    this.markerService.getSearchedEvents(this.options);
  }

  modifySearchOptions(){
    this.options.start ==='' ? this.options.start = new Date('July 27, 2020 23:30:00').toString() : new Date(this.options.start).toString();
    this.options.end ==='' ? this.options.end = new Date('July 27, 2080 23:30:00').toString() : new Date(this.options.end).toString();

    this.options.type = this.chosenType;
    this.options.tags = this.chosenTags;

    this.options.name = this.options.name.toLowerCase();
    this.options.organisator = this.options.organisator.toLowerCase();
  }

  resetSearchOptions(){
    this.options = {
      name: '',
      organisator: '',
      type: '',
      tags: [],
      start: '',
      end: '',
      maxPrice: 1000
    };
  }



}
