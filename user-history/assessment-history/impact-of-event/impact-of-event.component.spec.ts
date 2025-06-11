import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactOfEventComponent } from './impact-of-event.component';

describe('ImpactOfEventComponent', () => {
  let component: ImpactOfEventComponent;
  let fixture: ComponentFixture<ImpactOfEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpactOfEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImpactOfEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
