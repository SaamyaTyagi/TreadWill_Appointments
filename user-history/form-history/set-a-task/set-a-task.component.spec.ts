import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetATaskComponent } from './set-a-task.component';

describe('SetATaskComponent', () => {
  let component: SetATaskComponent;
  let fixture: ComponentFixture<SetATaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetATaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetATaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
