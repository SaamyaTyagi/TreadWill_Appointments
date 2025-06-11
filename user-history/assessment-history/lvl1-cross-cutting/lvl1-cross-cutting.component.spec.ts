import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lvl1CrossCuttingComponent } from './lvl1-cross-cutting.component';

describe('Lvl1CrossCuttingComponent', () => {
  let component: Lvl1CrossCuttingComponent;
  let fixture: ComponentFixture<Lvl1CrossCuttingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lvl1CrossCuttingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Lvl1CrossCuttingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
