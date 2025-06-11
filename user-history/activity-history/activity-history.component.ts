import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TherapySession {
  id: number;
  module: string;
  title: string;
  imagePath: string;
  completed: boolean;
}

@Component({
  selector: 'app-activity-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-history.component.html',
  styleUrl: './activity-history.component.css',
})
export class ActivityHistoryComponent {
  therapySessions: TherapySession[] = [
    {
      id: 1,
      module: 'Schema Therapy 1.1',
      title: 'Introduction to safety exercises',
      imagePath: 'assets/doc-portal/schema1.png',
      completed: true,
    },
    {
      id: 2,
      module: 'Schema Therapy 1.2',
      title: 'Safe place imagery for emotional trigger',
      imagePath: 'assets/doc-portal/schema2.png',
      completed: true,
    },
    {
      id: 3,
      module: 'Schema Therapy 1.3',
      title: 'Introduction to safety exercises',
      imagePath: 'assets/doc-portal/schema3.png',
      completed: false,
    },
    {
      id: 4,
      module: 'Schema Therapy 1.4',
      title: 'Introduction to safety exercises',
      imagePath: 'assets/doc-portal/schema3.png',
      completed: false,
    },
    {
      id: 5,
      module: 'Schema Therapy 1.4',
      title: 'Introduction to safety exercises',
      imagePath: 'assets/doc-portal/schema3.png',
      completed: false,
    },
  ];

  activeTab: string = 'activity';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
