import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodDisorderComponent } from './mood-disorder.component';

describe('MoodDisorderComponent', () => {
  let component: MoodDisorderComponent;
  let fixture: ComponentFixture<MoodDisorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodDisorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoodDisorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
