// bottom-nav.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  @Input() activeTab: string = 'activity';
  @Output() tabChange = new EventEmitter<string>();

  tabs = [
    { id: 'activity', label: 'Activity Progress' },
    { id: 'chat', label: 'Chat History' },
    { id: 'forms', label: 'Form History' },
    { id: 'assessment', label: 'Assessments' },
  ];

  switchTab(tabId: string): void {
    this.tabChange.emit(tabId);
  }
}
