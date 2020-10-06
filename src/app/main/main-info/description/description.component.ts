import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit, OnChanges {

  @Input() data: string;
  dataset;
  desc;
  constructor() { }

  ngOnInit(): void {
    this.desc = ''
  }

  ngOnChanges(changes: SimpleChanges) {
    const newDesc = changes['data'];
    if(newDesc.currentValue){
      this.desc = newDesc.currentValue;
    }
  }

}
