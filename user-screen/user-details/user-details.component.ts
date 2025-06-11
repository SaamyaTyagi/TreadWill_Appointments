import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetailsService } from '../../services/user/user-details.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, FormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  formSubmitted = false;
  editSequence = false;
  initialSequence = true;
  drag_drop = false;
  user: any;
  signedUp = false;
  // Change the type definition to allow string indexing
  therapySuggestions: { [key: string]: any[] } = {}; 
  EditButton = false;
  private userSubscription?: Subscription;
  useremail = 'l.goyal18'+'+'+ 121+'@gmail.com';
  intervention = 'Schema Therapy';

  constructor(
    private route: ActivatedRoute,
    private userService: UserDetailsService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const nickname = params['nickname'];
      console.log('Nickname from route:', nickname);
  
      this.userSubscription = this.userService.users$.subscribe((users) => {
        console.log('Users from service:', users);
  
        // Find the user by nickname
        this.user = users?.find((u) => u.nickname === nickname);
  
        if (this.user) {
          // Process therapy data to group it by category
          this.processTherapyData();
          console.log('User found:', this.user);
          console.log('Processed therapy suggestions:', this.therapySuggestions);
        // } else {
        //   console.warn(`User with nickname "${nickname}" not found.`);
        //   this.therapySuggestions = {};
        }
      });
    });

    // get user intervention data
         this.auth.getDocUsersIntervention(this.useremail).subscribe({
          next: (data: any) => {
        console.log('DocUsers Intervention:', data);
        if(data.data){    
          // this.processTherapyData();
          // this.user = users?.find((u) => u.nickname === nickname);

          const interventionsList = JSON.parse(data.data.interventions);


        //   // Step 3: Parse the 'interventions' string (which is a stringified array)
          this.user.intervention = interventionsList[0];

        // //   this.users = JSON.parse(data.data.docsusers);
        console.log('intervention list:', this.user.intervention);

         // get user intervention sequence data
         this.auth.getDocUsersInterventionSequence(this.useremail, this.user.intervention).subscribe({
          next: (data: any) => {
        console.log('DocUsersInterventionSequence list:', data);
        if(data.data){
          this.processTherapyData();
          // this.user = users?.find((u) => u.nickname === nickname);

        //   this.users = JSON.parse(data.data.docsusers);
        // console.log('Users list:', this.users);
          }
        }
        });

        }
      }
    });
  }

    /**
   * Initializes the therapy suggestions object structure
   * to prevent "is not iterable" errors
   */
  private initializeTherapySuggestionsStructure(): void {
    // Ensure all required categories exist
    this.therapySuggestions = this.therapySuggestions || {};
    this.therapySuggestions['Assessments'] = this.therapySuggestions['Assessments'] || [];
    this.therapySuggestions['Relaxation Activities'] = this.therapySuggestions['Relaxation Activities'] || [];
    this.therapySuggestions['Schema Therapy'] = this.therapySuggestions['Schema Therapy'] || [];
    this.therapySuggestions['CBT'] = this.therapySuggestions['CBT'] || [];
  }


/**
   * Gets therapy suggestions data - in future, this could call APIs
   * Currently using the local JSON data
   */
  get_therapySuggestions() {
    // if (!this.user.intervention) {
    //   return;
    // }
    this.auth.getInterventionSequenceData('Relaxation Activities').subscribe({
      next: (response: any) => { 
        this.therapySuggestions['Relaxation Activities'] = response.data;
        console.log('Relaxation Activities', this.therapySuggestions)
      },
      error: (err: any) => console.error('Error fetching Assessments:', err)
    });   
    
    this.auth.getInterventionSequenceData('Assessments').subscribe({
      next: (response: any) => { 
        this.therapySuggestions['Assessments'] = response.data;
        console.log('therapySuggestions', this.therapySuggestions)
      },
      error: (err: any) => console.error('Error fetching Assessments:', err)
    });
    this.auth.getInterventionSequenceData('CBT').subscribe({
      next: (response: any) => { 
        this.therapySuggestions['CBT'] = response.data;
        console.log('CBT', this.therapySuggestions)
      },
      error: (err: any) => console.error('Error fetching Assessments:', err)
    });

     this.auth.getInterventionSequenceData('Schema Therapy').subscribe({
      next: (response: any) => { 
        this.therapySuggestions['Schema Therapy'] = response.data;
        console.log('Schema Therapy', this.therapySuggestions)
      },
      error: (err: any) => console.error('Error fetching Assessments:', err)
    });
    
  }



























  /**
   * Process the user's therapy data to organize it by category
   */
  private processTherapyData(): void {
    console.log('Raw user therapies:', this.user.therapies);
    
    // Initialize therapy groups
    this.therapySuggestions = {
      'Assessments': [],
      'Relaxation Activities': [],
      [this.user.intervention]: []
    };
    
    // Check if therapies exist
    if (!this.user.therapies || !Array.isArray(this.user.therapies)) {
      console.warn('User has no therapies or invalid format');
      return;
    }
    
    // Process each therapy using the category field we added
    this.user.therapies.forEach((therapy: any) => {
      // Use the category property we added when creating the user
      if (therapy.category) {
        if (this.therapySuggestions[therapy.category]) {
          this.therapySuggestions[therapy.category].push(therapy);
        } else {
          console.warn(`Unknown therapy category: ${therapy.category}`);
        }
      } else {
        // Fallback for therapies without category (legacy data)
        console.warn('Therapy missing category information:', therapy);
        
        // Try to guess the category from the name (not reliable)
        if (therapy.card_name?.includes('Assessment')) {
          this.therapySuggestions['Assessments'].push(therapy);
        } else if (therapy.card_name?.includes('Relaxation')) {
          this.therapySuggestions['Relaxation Activities'].push(therapy);
        } else {
          // Default to the user's selected intervention
          this.therapySuggestions[this.user.intervention].push(therapy);
        }
      }
    });
    
    console.log('Processed therapy suggestions:', this.therapySuggestions);
  }
  
  
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  back() {
    this.router.navigate(['main/doc/my-user']);
  }
  
  edit() {
    this.get_therapySuggestions();
    this.EditButton = !this.EditButton;
  }
  
  sendReminder() {
    this.signedUp = true;
  }
  toggleSelection(card: any): void {
    card.default_in_series = !card.default_in_series;
  }
  editOrder() {
    this.drag_drop = true;
    this.editSequence = false;
  }
    drop(event: CdkDragDrop<string[]>, intervention_name: string) {
      moveItemInArray(this.therapySuggestions[intervention_name], event.previousIndex, event.currentIndex);
    }
    viewFinalSeq() {
      this.editSequence = false;
      this.drag_drop = false;
      this.initialSequence = false;
    }
    editseq() {
      this.editSequence = !this.editSequence;
    }
    sendForm(){
      this.formSubmitted = true;
    }
}
