import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsGoingComponent } from './events-going.component';

describe('EventsGoingComponent', () => {
  let component: EventsGoingComponent;
  let fixture: ComponentFixture<EventsGoingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsGoingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsGoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
