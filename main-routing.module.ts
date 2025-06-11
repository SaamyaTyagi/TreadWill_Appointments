import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '@/shared/auth/auth.guard';
import { SupportGroupsComponent } from './support-groups/support-groups.component';
import { GamesComponent } from './games/games.component';
import { GamesListComponent } from './games/games-list/games-list.component';
import { LogoutComponent } from '@/shared/auth/logout/logout.component';
import { MainComponent } from './main.component';
import { ScoreComponent } from './score/score.component';
import { PhqNineComponent } from './score/phq-nine/phq-nine.component';
import { GadSevenComponent } from './score/gad-seven/gad-seven.component';
import { CommonGameComponent } from './games/games-list/common-game/common-game.component';
import { SurveyComponent } from './shared/survey/survey.component';
import { NeedToTalkComponent } from '@/main/need-to-talk/need-to-talk.component';
import { SettingsComponent } from '@/main/settings/settings.component';
import {GetQuestionnaireComponent} from '@/main/dashboard/get-questionnaire/get-questionnaire.component';
import {ImageSliderComponent} from '@/main/shared/image-slider/image-slider.component';
import {ModeDialogueComponent} from '@/main/games/games-list/common-game/mode-dialogue/mode-dialogue.component';
import {DocDashboardComponent} from '@/main/doc-dashboard/doc-dashboard.component';

import {LoginComponent} from '@/main/doc-dashboard/login/login.component';
import {MyUserComponent} from '@/main/doc-dashboard/user-screen/my-user/my-user.component';
import {AddUserComponent} from '@/main/doc-dashboard/user-screen/add-user/add-user.component';
import {TutorialComponent} from '@/main/doc-dashboard/user-screen/tutorial/tutorial.component';
import {UserDetailsComponent} from '@/main/doc-dashboard/user-screen/user-details/user-details.component';





export const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Home' },
      },
      { path: 'survey', component: SurveyComponent }, // :id here is step_id
      // { path: 'mode-dialogue', component: ModeDialogueComponent }, // added here temporarily
      { path: 'survey/:id', component: SurveyComponent }, // :id here is step_id
      {
        path: 'support-groups',
        component: SupportGroupsComponent,
        data: { title: 'Support Group' },
      },
      {
        path: 'need-to-talk',
        component: NeedToTalkComponent,
        data: { title: 'Need to talk' },
      },
      {
        path: 'support-groups/:id',
        component: SupportGroupsComponent,
      },
      { path: 'get-questionnaire', component: GetQuestionnaireComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { title: 'Settings' },
        children: [
          {
            path: ':name',
            component: SettingsComponent,
            data: { title: '' },
          },
        ],
      },
      {
        path: 'games',
        component: GamesComponent,
        data: { title: 'Games' },
        children: [
          { path: '', component: GamesListComponent },
          { path: ':name', component: CommonGameComponent },
          { path: ':name/:id', component: CommonGameComponent },
        ],
      },
      {
        path: 'scores',
        component: ScoreComponent,
        data: { title: 'Questionnaire Scores' },
        children: [
          {
            path: 'phq',
            component: PhqNineComponent,
            data: { title: 'Questionnaire Scores' },
          },
          {
            path: 'gad',
            component: GadSevenComponent,
            data: { title: 'Questionnaire Scores' },
          },
        ],
      },

      { path: '', redirectTo: '/main/dashboard', pathMatch: 'full' },
      { path: 'logout', component: LogoutComponent },
      // { path: 'image-slider', component: ImageSliderComponent },

      //PATHS FOR DOC PORTAL 
      { path: 'doc', 
        data: { title: "Doc's Dashboard" },
       loadComponent: () =>
              import('./doc-dashboard/doc-dashboard.component').then(
                (m) => m.DocDashboardComponent
              ),
      // },
      // {
      //   path: 'user-screen',
        children: [

             {
            path: '',
            loadComponent: () =>
              import('./doc-dashboard/login/login.component').then(
                (m) => m.LoginComponent
              ),
          },
          {
            path: 'my-user',
            loadComponent: () =>
              import('./doc-dashboard/user-screen/my-user/my-user.component').then(
                (m) => m.MyUserComponent
              ),
          },
          {
            path: 'add-user',
            loadComponent: () =>
              import('./doc-dashboard/user-screen/add-user/add-user.component').then(
                (m) => m.AddUserComponent
              ),
          },
          {
            path: 'tutorial',
            loadComponent: () =>
              import('./doc-dashboard/user-screen/tutorial/tutorial.component').then(
                (m) => m.TutorialComponent
              ),
          },
          {
            path: 'user-detail/:nickname',
            loadComponent: () =>
              import('./doc-dashboard/user-screen/user-details/user-details.component').then(
                (m) => m.UserDetailsComponent
              ),
          },
        ],
      },

      //TILL HERE


      {
        path: 'resources',
        loadChildren: () =>
          import('./resources/resources.module').then(m => m.ResourcesModule),
      },
      {
        path: 'extra-resources',
        loadChildren: () =>
          import('../shared/extra-resources.module').then(
            m => m.ExtraResourcesModule,
          ),
      },
      {
        path: 'extra-resources/:id',
        loadChildren: () =>
          import('../shared/extra-resources.module').then(
            m => m.ExtraResourcesModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
