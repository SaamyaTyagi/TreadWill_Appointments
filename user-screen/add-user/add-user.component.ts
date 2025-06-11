import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../services/user/user-details.service';
import { AuthService } from '../../services/auth.service';
import * as therapyData from '../../../../../assets/doc-portal/therapyData.json';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  imports: [NavBarComponent, CommonModule, FormsModule, CdkDropList, CdkDrag],
})
export class AddUserComponent implements OnInit {
  // UI state flags
  formSubmitted = false;
  editSequence = false;
  initialSequence = true;
  drag_drop = false;
  
  // Available intervention types
  interventions = ['Schema Therapy', 'CBT'];
  
  // User data model
  user: { 
    email: string; 
    nickname: string; 
    intervention:''|'Schema Therapy'|'CBT' 
  } = { 
    email: '', 
    nickname: '', 
    intervention: '' 
  };

  // Therapy suggestions loaded from JSON file
  therapySuggestions: { [key: string]: any[] } = {};

  constructor(
    private router: Router, 
    private userService: UserDetailsService, 
    private http: AuthService
  ) {
    console.log('AddUserComponent constructor called');
  }

  /**
   * Initialize component and load therapy data
   */
  ngOnInit(): void {
    // Load therapy data from JSON file
    // This simulates what would normally come from an API
    this.loadTherapyData();
    
    // Ensure structure exists to prevent "is not iterable" errors
    // this.initializeTherapySuggestionsStructure();
  }
  
  /**
   * Loads therapy suggestion data from JSON file or API
   * In future, this could be replaced with API calls
   */
  private loadTherapyData(): void {
    try {
      // Load from static JSON file (in real app, this would be API calls)
      this.therapySuggestions = JSON.parse(JSON.stringify(therapyData)) as { [key: string]: any[] };
      console.log('Loaded therapy data from JSON file');
    } catch (error) {
      console.error('Error loading therapy data:', error);
      // Initialize with empty arrays as fallback
      // this.initializeTherapySuggestionsStructure();
    }
  }
  


  
  /**
   * Determines if therapy selection section should be shown
   */
  shouldShowTherapySection(): boolean {
    return !!this.user.intervention && !this.formSubmitted;
  }

  /**
   * Toggles selection of a therapy card
   */
  toggleSelection(card: any): void {
    card.default_in_series = !card.default_in_series;
  }

  /**
   * Submits the form and saves the user with selected therapies
   */
  sendForm() {
    this.formSubmitted = true;
    // send details of user to backend
    //  const userData = {
    //   useremail: this.user.email,
    //   doc_email_id: 'l.goyal18@gmail.com',
    //   nickname: this.user.nickname,
    // };
    // this.http.postUserData(userData).subscribe({
    //   next: (response: any) => {
    //     console.log('User data updated in backend:', response);
    //   error: (error: any) => {
    //     console.error('Error:', error);
    //   }
    // }
    // });

   const userInterventionData = {
      useremail: this.user.email,
      intervention_name: this.user.intervention,
    };

   this.http.postUserIntervention(userInterventionData).subscribe({
      next: (response: any) => {
        console.log('User data updated in backend:', response);
      error: (error: any) => {
        console.error('Error:', error);
      }
    }

    });


   // Therapies will be added in user detail section 
  
  //   // Get filtered therapies with category information added
  //   const interventionTherapies = this.therapySuggestions[this.user.intervention]?.filter(
  //     therapy => therapy.default_in_series
  //   ).map(therapy => ({
  //     ...therapy,
  //     category: this.user.intervention  // Add category information
  //   })) || [];
  
  //   const assessmentTherapies = this.therapySuggestions['Assessments']?.filter(
  //     therapy => therapy.default_in_series
  //   ).map(therapy => ({
  //     ...therapy,
  //     category: 'Assessments'  // Add category information
  //   })) || [];
  
  //   const relaxationTherapies = this.therapySuggestions['Relaxation Activities']?.filter(
  //     therapy => therapy.default_in_series
  //   ).map(therapy => ({
  //     ...therapy,
  //     category: 'Relaxation Activities'  // Add category information
  //   })) || [];
  
  //   // Combine all therapies with their category information
  //   const selectedTherapies = [
  //     ...interventionTherapies,
  //     ...assessmentTherapies,
  //     ...relaxationTherapies
  //   ];
  
    // const newUser = {
    //   email: this.user.email,
    //   nickname: this.user.nickname,
    //   intervention: this.user.intervention,
    //   createdAt: new Date().toISOString(),
    //   therapies: [], // Now includes category information
    // };
    
    // this.userService.addUser(newUser);
    // console.log('New user added with categorized therapies:', newUser);
  }
  

  // /**
  //  * Toggle edit sequence mode
  //  */
  // editseq() {
  //   this.editSequence = !this.editSequence;
  // }

  // /**
  //  * View final sequence after editing
  //  */
  // viewFinalSeq() {
  //   this.editSequence = false;
  //   this.drag_drop = false;
  //   this.initialSequence = false;
  // }

  // /**
  //  * Enable drag and drop reordering mode
  //  */
  // editOrder() {
  //   this.drag_drop = true;
  //   this.editSequence = false;
  // }

  // /**
  //  * Handle drag and drop events for reordering therapies
  //  */
  // drop(event: CdkDragDrop<string[]>, intervention_name: string) {
  //   moveItemInArray(this.therapySuggestions[intervention_name], event.previousIndex, event.currentIndex);
  // }

  /**
   * Navigate to the user listing screen
   */
  viewUser() {
    this.router.navigate(['main/doc/my-user']);
  }
}
