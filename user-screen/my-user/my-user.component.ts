// my-user.component.ts
import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { UserDetailsService } from '../../services/user/user-details.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/Date/date-format.pipe';
import { InitialsPipe } from '../../pipes/UserBadge/initials.pipe';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-my-user',
  standalone: true,
  imports: [NavBarComponent, CommonModule, DateFormatPipe, InitialsPipe],
  templateUrl: './my-user.component.html',
  styleUrl: './my-user.component.css',
  providers: [AuthService]
})
export class MyUserComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  isUserSignedUp: boolean = false;
  showUsers = false;
  emailid = 'l.goyal18@gmail.com';

  constructor(
    private userService: UserDetailsService,
    private router: Router,
    private auth: AuthService) {}

  ngOnInit() {
    // this.userService.users$.subscribe((users) => {
    //   this.users = users;
    // });
    this.auth.getDocUsersList(this.emailid).subscribe({
      next: (data: any) => {
        console.log('Users list:', data);
        if(data.data.docsusers){
          this.users = JSON.parse(data.data.docsusers);
        console.log('Users list:', this.users);
           this.showUsers = true;


     this.users.forEach(user => {
        console.log(`User DETAILS: ${user.useremail}, Name: ${user.nickname}`);

    const newUser = {
      email: user.useremail,
      nickname: user.nickname,
      intervention: user.intervention,
      createdAt: new Date().toISOString(),
      therapies: [], // Now includes category information
    };
    
    this.userService.addUser(newUser);
    console.log('New user added with categorized therapies:', newUser);




      });


        }
      }
    });
  }

  viewUserDetails(user: any) {
    this.router.navigate(['main/doc/user-detail', user.nickname]);
  }

  goBack() {
    this.selectedUser = null;
  }

  sendReminder() {
    // Implement reminder functionality
    console.log('Sending reminder to:', this.selectedUser.email);
  }
}
