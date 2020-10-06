import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { MarkerService } from 'src/app/services/marker.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit, OnChanges {

  @Input() data: object;
  
  dataset;
  time;
  tags = [];

  requirements = ['Above 18 y/o', 'Your own drinks'];
  constructor(private markerService: MarkerService) { }

  ngOnInit(): void {
    this.setDummyData();
  }

  setDummyData(){
    this.time = {
      start: '',
      end: ''
    }
    this.dataset = {
      title: '',
      organisator: '',
      image: '',
      type: '',
      tags:  [],
      time: {
        start: '',
        end: ''
      },
      place: '',
      price: '',
      req: ''
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    const generalInfo = changes.data;

    console.log(generalInfo.currentValue);
    if (generalInfo.currentValue){
      this.dataset = generalInfo.currentValue;

      this.dataset.req = JSON.parse(this.dataset.req[0]) 

      // generalInfo.currentValue.tags = ["["tag1","tag2","tag3"]"]
      const tags = JSON.parse(generalInfo.currentValue.tags[0]);
      this.normalizeTags(tags);

      const time = JSON.parse(generalInfo.currentValue.time);
      this.time = time;
      console.log(this.time)
      this.normalizeTime(this.time)
    }
  }

  normalizeTags(tags: Array<string>){
    this.tags = [];
    for (const tag of tags){
      this.tags.push({
        name: tag,
        type: tag,
        bgColor: 'hsl(170,0%,94%)',
        textColor: 'rgb(0,0,0)'
      })
    }
  }

  normalizeTime(time:any){
    const start = time.start.split('T');
    const end = time.end.split('T');

    const newTime = {
      startDate: start[0].replaceAll('-','/'),
      startTime: start[1],
      endDate: end[0].replaceAll('-','/'),
      endTime: end[1],
    }

    this.time = newTime;
  }

  findPlace(){
    this.markerService.focusOnCurrentEvent()
  }




}


