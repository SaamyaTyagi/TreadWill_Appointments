import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADHDselfReportComponent } from './adhdself-report.component';

describe('ADHDselfReportComponent', () => {
  let component: ADHDselfReportComponent;
  let fixture: ComponentFixture<ADHDselfReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ADHDselfReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ADHDselfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
