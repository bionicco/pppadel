import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRepeatBtnComponent } from './activity-repeat-btn.component';

describe('ActivityRepeatBtnComponent', () => {
  let component: ActivityRepeatBtnComponent;
  let fixture: ComponentFixture<ActivityRepeatBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityRepeatBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityRepeatBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
