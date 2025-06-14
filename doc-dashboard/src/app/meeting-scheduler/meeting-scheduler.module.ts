import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingSchedulerComponent } from './meeting-scheduler.component';
import { MeetingSchedulerRoutingModule } from './meeting-scheduler-routing.module';

@NgModule({
  declarations: [MeetingSchedulerComponent],
  imports: [
    CommonModule,
    MeetingSchedulerRoutingModule
  ]
})
export class MeetingSchedulerModule { }
