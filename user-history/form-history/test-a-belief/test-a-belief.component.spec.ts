import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestABeliefComponent } from './test-a-belief.component';

describe('TestABeliefComponent', () => {
  let component: TestABeliefComponent;
  let fixture: ComponentFixture<TestABeliefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestABeliefComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestABeliefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
