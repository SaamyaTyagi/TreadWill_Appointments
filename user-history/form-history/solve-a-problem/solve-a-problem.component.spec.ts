import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolveAProblemComponent } from './solve-a-problem.component';

describe('SolveAProblemComponent', () => {
  let component: SolveAProblemComponent;
  let fixture: ComponentFixture<SolveAProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolveAProblemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolveAProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
