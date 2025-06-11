import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAWorryComponent } from './control-a-worry.component';

describe('ControlAWorryComponent', () => {
  let component: ControlAWorryComponent;
  let fixture: ComponentFixture<ControlAWorryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlAWorryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlAWorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
