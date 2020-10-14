import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCompanionsComponent } from './your-companions.component';

describe('YourCompanionsComponent', () => {
  let component: YourCompanionsComponent;
  let fixture: ComponentFixture<YourCompanionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourCompanionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourCompanionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
