import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingSchedulerComponent } from './meeting-scheduler.component';
import { UpcomingAppointmentsComponent } from './upcoming-appointments/upcoming-appointments.component';
import { PreviousAppointmentsComponent } from './previous-appointments/previous-appointments.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';


const routes: Routes = [
  { path: '', redirectTo: 'upcoming', pathMatch: 'full' },
  { path: 'upcoming', component: UpcomingAppointmentsComponent },
  { path: 'previous', component: PreviousAppointmentsComponent },
  { path: 'schedule', component: ScheduleFormComponent },
  { path: 'details/:id', component: AppointmentDetailComponent } // optional for individual view
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingSchedulerRoutingModule { }
