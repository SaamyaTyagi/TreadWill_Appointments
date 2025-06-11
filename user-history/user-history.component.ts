// user-history.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, BottomNavComponent],
})
export class UserHistoryComponent implements OnInit {
  activeTab: string = 'activity';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to route changes to update the active tab
    this.route.firstChild?.url.subscribe((segments) => {
      if (segments && segments.length > 0) {
        const currentTab = segments[0].path;
        this.activeTab = currentTab;
      }
    });

    // If no child route is active, navigate to default tab
    if (!this.route.firstChild) {
      this.navigateToTab(this.activeTab);
    }
  }

  navigateToTab(tabId: string): void {
    this.activeTab = tabId;
    // Use relative navigation
    this.router.navigate([tabId], { relativeTo: this.route });
  }
}
