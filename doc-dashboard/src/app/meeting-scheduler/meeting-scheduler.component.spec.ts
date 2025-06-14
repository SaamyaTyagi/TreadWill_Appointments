import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingSchedulerComponent } from './meeting-scheduler.component';

describe('MeetingSchedulerComponent', () => {
  let component: MeetingSchedulerComponent;
  let fixture: ComponentFixture<MeetingSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingSchedulerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
