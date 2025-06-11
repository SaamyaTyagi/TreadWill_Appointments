import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateAThoughtComponent } from './evaluate-a-thought.component';

describe('EvaluateAThoughtComponent', () => {
  let component: EvaluateAThoughtComponent;
  let fixture: ComponentFixture<EvaluateAThoughtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluateAThoughtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluateAThoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
