import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalAngerScaleComponent } from './clinical-anger-scale.component';

describe('ClinicalAngerScaleComponent', () => {
  let component: ClinicalAngerScaleComponent;
  let fixture: ComponentFixture<ClinicalAngerScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalAngerScaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClinicalAngerScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
