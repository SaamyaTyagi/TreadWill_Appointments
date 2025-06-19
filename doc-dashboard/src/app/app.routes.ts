import { Routes } from '@angular/router';
import { UpcomingAppointmentsComponent } from './upcoming-appointments/upcoming-appointments.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'upcoming-appointments', pathMatch: 'full' },
  { path: 'upcoming-appointments', component: UpcomingAppointmentsComponent },
  { path: 'schedule-session', component: ScheduleFormComponent }
];
