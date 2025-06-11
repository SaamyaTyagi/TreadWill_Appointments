// user-history-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHistoryComponent } from './user-history.component';
import { ActivityHistoryComponent } from './activity-history/activity-history.component';
import { ChatHistoryComponent } from './chat-history/chat-history.component';
import { FormHistoryComponent } from './form-history/form-history.component';
import { AssessmentHistoryComponent } from './assessment-history/assessment-history.component';

const routes: Routes = [
  {
    path: '',
    component: UserHistoryComponent,
    children: [
      { path: 'activity', component: ActivityHistoryComponent },
      { path: 'chat', component: ChatHistoryComponent },
      { path: 'forms', component: FormHistoryComponent },
      { path: 'assessment', component: AssessmentHistoryComponent },
      { path: '', redirectTo: 'activity', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserHistoryRoutingModule {}
