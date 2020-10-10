import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCompanionComponent } from './profile-companion.component';

describe('ProfileCompanionComponent', () => {
  let component: ProfileCompanionComponent;
  let fixture: ComponentFixture<ProfileCompanionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCompanionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCompanionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
