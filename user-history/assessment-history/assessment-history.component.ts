import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-assessment-history',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './assessment-history.component.html',
  styleUrl: './assessment-history.component.css',
})
export class AssessmentHistoryComponent {
  assessmentTypes = [
    {
      name: 'Level 1 Cross-Cutting Symptom Measue',
      route: '/user-history/assessments/lvl1-cross-cutting',
      imagePath: 'assets/user_history_assessment_history/lvl1.png',
    },
    {
      name: 'Adult ADHD Self-Report Scale',
      route: '/user-history/assessments/adhdself-report',
      imagePath: 'assets/user_history_assessment_history/2.png',
    },
    {
      name: 'Impact of Event-Revised',
      route: '/user-history/assessments/impact-of-event',
      imagePath: 'assets/user_history_assessment_history/3.png',
    },
    {
      name: 'Clinical Anger Scale',
      route: '/user-history/assessments/clinical-anger-scale',
      imagePath: 'assets/user_history_assessment_history/4.png',
    },
    {
      name: 'Mood Disorder Questionnaire',
      route: '/user-history/assessments/mood-disorder',
      imagePath: 'assets/user_history_assessment_history/5.png',
    },
    {
      name: 'Patient Health Questionnaire',
      route: '/user-history/assessments/patient-health',
      imagePath: 'assets/user_history_assessment_history/6.png',
    },
  ];
}
