import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsOrganisingComponent } from './events-organising.component';

describe('EventsOrganisingComponent', () => {
  let component: EventsOrganisingComponent;
  let fixture: ComponentFixture<EventsOrganisingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsOrganisingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsOrganisingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
