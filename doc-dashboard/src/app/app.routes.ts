import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scheduler',
    loadChildren: () =>
      import('./meeting-scheduler/meeting-scheduler.module').then(
        (m) => m.MeetingSchedulerModule
      )
  }
];