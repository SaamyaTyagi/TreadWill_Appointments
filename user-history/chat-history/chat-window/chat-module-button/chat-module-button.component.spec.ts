import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatModuleButtonComponent } from './chat-module-button.component';

describe('ChatModuleButtonComponent', () => {
  let component: ChatModuleButtonComponent;
  let fixture: ComponentFixture<ChatModuleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatModuleButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatModuleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
