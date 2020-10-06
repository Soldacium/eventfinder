import { Component, Input, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { MarkerService } from '../marker.service';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css']
})
export class MarkerComponent implements OnInit {

  @Input() data: Event;

  constructor(private markerService: MarkerService) { }



  ngOnInit(): void {
    console.log(this.data)
  }

  openEvent(data){
    this.markerService.openEvent(data)
  }

}
