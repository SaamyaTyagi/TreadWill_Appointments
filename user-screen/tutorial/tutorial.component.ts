import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import * as therapyData from '../../../../../assets/doc-portal/therapyData.json';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FormsModule, CdkDropList, CdkDrag],
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  currentStep = 1;
  totalSteps = 8;

  // Mock data for display that mirrors the actual add-user component
  formSubmitted = false;
  editSequence = false;
  initialSequence = true;
  drag_drop = false;
  interventions = ['Schema Therapy', 'CBT'];
  user: { email: string; nickname: string; intervention: string } = {
    email: '',
    nickname: '',
    intervention: ''
  };

  therapySuggestions: { [key: string]: any[] } = therapyData as { [key: string]: any[] };

  // Tutorial-specific properties
  highlightedElement = '';
  tooltipPosition = { top: 0, left: 0 };
  tooltipText = '';
  tooltipHeader = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setHighlightForCurrentStep();

    window.addEventListener('scroll', this.updateTooltipPosition.bind(this));
    window.addEventListener('resize', this.updateTooltipPosition.bind(this));

    setTimeout(() => {
      this.updateTooltipPosition();
    }, 500);
  }

  // Set highlight and tooltip for the current step
  setHighlightForCurrentStep(): void {
    // Reset values
    this.highlightedElement = '';
    this.tooltipText = '';
    this.tooltipHeader = '';

    switch(this.currentStep) {
      case 1:
        this.highlightedElement = 'email-input';
        this.tooltipText = 'Start by entering the email address of your user. This will be used to send them an invitation.';
        break;
      case 2:
        this.highlightedElement = 'nickname-input';
        this.tooltipText = 'Give your user a nickname that will help you identify them in your dashboard.';
        break;
      case 3:
        this.highlightedElement = 'intervention-select';
        this.tooltipText = 'Pick an intervention here';
        break;
      case 4:
        this.highlightedElement = 'therapy-sequence';
        this.tooltipText = 'A default sequence of activities in the selected intervention appears here';
        break;
      case 5:
        this.highlightedElement = 'edit-sequence-btn';
        this.tooltipText = 'Click this button to customize which therapy activities will be included for your user.';
        break;
      case 6:
        this.highlightedElement = 'therapy-activities';
        this.tooltipText = 'Select/unselect any activity from this sequence to add/remove';
        break;
      case 7:
        this.highlightedElement = 'edit-order-btn';
        this.tooltipText = 'Click this button to rearrange the order of activities in the therapy sequence.';
        break;
      case 8:
        this.highlightedElement = 'send-email-btn';
        this.tooltipText = 'Review the final sequence and click to send an email invitation to your user with their personalized therapy plan.';
        break;
    }

    setTimeout(() => {
      this.updateTooltipPosition();
    }, 100);
  }

  // Update tooltip position based on highlighted element
  updateTooltipPosition(): void {
    if (!this.highlightedElement) return;

    const element = document.getElementById(this.highlightedElement);
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate the vertical position
      let topPosition = rect.bottom + window.scrollY -100; // Position below element with 15px gap

      // Calculate the horizontal position to center the tooltip
      // This accounts for right-aligned elements by centering the tooltip to the element's center
      const elementCenter = rect.left + window.scrollX + (rect.width / 2);
      let leftPosition = elementCenter - 175; // Center tooltip (tooltip width is 350px)

      // Adjust horizontal position if it would go off-screen
      if (leftPosition < 20) {
        leftPosition = 20;
      } else if (leftPosition + 350 > viewportWidth - 20) {
        leftPosition = viewportWidth - 370;
      }

      // Set the triangle position to point to the element's center
      this.setTrianglePosition(elementCenter - leftPosition);

      // Update the tooltip position
      this.tooltipPosition = {
        top: topPosition,
        left: leftPosition
      };
    }
  }

  // Sets CSS variable for the triangle position
  setTrianglePosition(position: number): void {
    document.documentElement.style.setProperty('--triangle-position', `${position}px`);
  }

  // Add this method to implement demo actions when user clicks Next
  performDemoActionForCurrentStep(): void {
    switch(this.currentStep) {
      case 1:
        if (this.user.email === '') {
          this.user.email = 'user@example.com';
        }
        break;
      case 2:
        if (this.user.nickname === '') {
          this.user.nickname = 'John';
        }
        break;
      case 3:
        if (this.user.intervention === '') {
          this.user.intervention = 'Schema Therapy';
          this.initialSequence = true;
        }
        break;
      case 4:
        // New step - just highlight the therapy sequence area
        // No action needed, just showing the default sequence
        break;
      case 5:
        // No changes to action
        this.editSequence = true;
        this.drag_drop = false;
        this.initialSequence = false;
        break;
      case 6:
        // New step - highlighting select/unselect functionality
        // No action needed, just showing the activity selection area
        break;
      case 7:
        this.drag_drop = true;
        this.editSequence = false;
        break;
      case 8:
        // Previously case 6
        // No changes to action
        this.drag_drop = false;
        this.editSequence = false;
        this.viewFinalSeq();
        break;
    }
  }

  // Navigation functions
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // Perform demo action for current step before moving to next step
      this.performDemoActionForCurrentStep();

      // Then advance to next step
      this.currentStep++;
      this.setHighlightForCurrentStep();
      this.scrollToHighlightedElement();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      // Store current step before decrementing
      const previousStep = this.currentStep;

      // Decrement step
      this.currentStep--;

      // Handle state changes when moving backward
      switch(this.currentStep) {
        case 1:
        case 2:
        case 3:
          // Going back to email, nickname, or intervention step
          // Reset sequence editing states
          this.editSequence = false;
          this.drag_drop = false;
          this.initialSequence = true;
          break;

        case 4:
          // Going back to default sequence step from edit sequence
          this.editSequence = false;
          this.drag_drop = false;
          this.initialSequence = true;
          break;

        case 5:
          // Going back to edit sequence button step from selection step
          this.editSequence = false;
          this.drag_drop = false;
          this.initialSequence = false;
          break;

        case 6:
          // Going back to selection step from drag & drop step
          this.editSequence = true;
          this.drag_drop = false;
          this.initialSequence = false;
          break;

        case 7:
          // Going back to drag & drop step from final step
          this.drag_drop = true;
          this.editSequence = false;
          this.initialSequence = false;
          break;
      }

      // Update highlight and tooltip
      this.setHighlightForCurrentStep();
      this.scrollToHighlightedElement();
    }
  }

  scrollToHighlightedElement(): void {
    setTimeout(() => {
      const element = document.getElementById(this.highlightedElement);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  // Mock functions from add-user component
  editseq(): void {
    this.editSequence = true;
    this.drag_drop = false;
    this.initialSequence = false;

    // If we're not on the right tutorial step, advance to it
    if (this.currentStep < 4) {
      this.currentStep = 4;
      this.setHighlightForCurrentStep();
    }
  }

  viewFinalSeq(): void {
    this.editSequence = false;
    this.drag_drop = false;
    this.initialSequence = false;

    // If we're on step 6, simulate form submission
    if (this.currentStep === 6) {
      setTimeout(() => {
        this.formSubmitted = true;
      }, 1000);
    }
  }

  editOrder(): void {
    this.drag_drop = true;
    this.editSequence = false;

    // If we're not on the right tutorial step, advance to it
    if (this.currentStep < 5) {
      this.currentStep = 5;
      this.setHighlightForCurrentStep();
    }
  }

  drop(event: CdkDragDrop<string[]>, intervention_name: string): void {
    // Simulated drag-drop functionality
    moveItemInArray(this.therapySuggestions[intervention_name], event.previousIndex, event.currentIndex);
  }

  toggleSelection(card: any): void {
    // Toggle selection for cards
    card.default_in_series = !card.default_in_series;
  }

  // Navigation functions
  viewUser(): void {
    this.router.navigate(['main/doc/my-user']);
  }

  completeTutorial(): void {
    this.router.navigate(['main/doc/my-user']);
  }

  // Clean up event listeners when component is destroyed
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.updateTooltipPosition.bind(this));
    window.removeEventListener('resize', this.updateTooltipPosition.bind(this));
  }
}