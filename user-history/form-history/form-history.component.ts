// form-history.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './form-history.component.html',
  styleUrl: './form-history.component.css',
})
export class FormHistoryComponent {
  formTypes = [
    {
      name: 'Solve a Problem',
      route: '/user-history/forms/solve-a-problem', // Use absolute path
      imagePath: 'assets/user_history_form_history/solve_a_problem.png',
    },
    {
      name: 'Set a Task',
      route: '/user-history/forms/set-a-task', // Use absolute path
      imagePath: 'assets/user_history_form_history/set_a_task.png',
    },
    // Update the remaining routes similarly
    {
      name: 'Evaluate a Thought',
      route: '/user-history/forms/evaluate-a-thought',
      imagePath: 'assets/user_history_form_history/evaluate_a_thought.png',
    },
    {
      name: 'Test a belief',
      route: '/user-history/forms/test-a-belief',
      imagePath: 'assets/user_history_form_history/test_a_belief.png',
    },
    {
      name: 'Control a worry',
      route: '/user-history/forms/control-a-worry',
      imagePath: 'assets/user_history_form_history/control_a_worry.png',
    },
    {
      name: 'Change a belief',
      route: '/user-history/forms/change-a-belief',
      imagePath: 'assets/user_history_form_history/change_a_belief.png',
    },
  ];
}
