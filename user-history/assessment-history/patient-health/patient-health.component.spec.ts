import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHealthComponent } from './patient-health.component';

describe('PatientHealthComponent', () => {
  let component: PatientHealthComponent;
  let fixture: ComponentFixture<PatientHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientHealthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
