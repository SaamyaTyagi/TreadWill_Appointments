import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';




@Component({
  selector: 'app-doc-dashboard',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './doc-dashboard.component.html',
  styleUrl: './doc-dashboard.component.scss'
})
export class DocDashboardComponent {

}
