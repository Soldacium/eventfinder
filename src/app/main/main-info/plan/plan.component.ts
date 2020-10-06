import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit, OnChanges {

  
  @Input() data: object;
  constructor() { }

  plan: Array<object>;

  ngOnInit(): void {
    this.plan = []
  }

  ngOnChanges(change: SimpleChanges) {
    const newPlan = change['data'];
    if(newPlan.currentValue){
      this.plan = JSON.parse(newPlan.currentValue);
    }
  }


}
