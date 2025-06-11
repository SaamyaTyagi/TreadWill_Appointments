import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeABeliefComponent } from './change-a-belief.component';

describe('ChangeABeliefComponent', () => {
  let component: ChangeABeliefComponent;
  let fixture: ComponentFixture<ChangeABeliefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeABeliefComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeABeliefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
