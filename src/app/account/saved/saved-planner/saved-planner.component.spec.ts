import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPlannerComponent } from './saved-planner.component';

describe('SavedPlannerComponent', () => {
  let component: SavedPlannerComponent;
  let fixture: ComponentFixture<SavedPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
