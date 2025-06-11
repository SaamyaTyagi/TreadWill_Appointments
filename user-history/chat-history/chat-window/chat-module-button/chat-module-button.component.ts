import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ChatModuleButtonModel} from '@/main/chatbot/chat-window/chat-module-button/chat-module-button.model';
@Component({
  selector: 'app-chat-module-button',
  templateUrl: './chat-module-button.component.html',
  styleUrls: ['./chat-module-button.component.scss']
})
export class ChatModuleButtonComponent implements OnInit {
  @Input() moduleButtonList!: ChatModuleButtonModel[];
  @Input() dataLoaded!: boolean;
  @Input() showSelectedModuleButton!: boolean;
  @Output() moduleCardClicked  = new EventEmitter<any>();
  // @Input() badgesCountColor!: string;
  @ViewChild('widgetsContent', { static: false })
  public widgetsContent!: ElementRef<any>;

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft + 250,
      behavior: 'smooth',
    });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft - 250,
      behavior: 'smooth',
    });
  }

  constructor() {}

  ngOnInit() {
    console.log('module button list', this.dataLoaded, this.moduleButtonList);
  }
  getCardBackgroundColor(therapyName: string) {
    // console.log('event', therapyName);
    if (therapyName === 'Schema Therapy') {
      return '#7F9DEC';
    } else if (therapyName === 'CBT') {
      return '#FF9B3F';
    } else if (therapyName === 'Independent') {
      return '#FBF450';
    }
  }

  getTagBackgroundColor(tagName: string) {
    
    if (tagName === 'Next step in therapy') {
      return 'module-button-next-step';
    } else if (tagName === 'Recommended every 7 days') {
      return 'module-button-recommended';
    } else if (tagName === 'This is refreshing') {
      return 'module-button-refreshing';
    } else if (!tagName) {
      return 'module-button-no-card-tag';
}
  }

  onModuleCardClicked(moduleButton: ChatModuleButtonModel) {
    console.log('event', moduleButton);
    this.moduleCardClicked.emit(moduleButton);
  }
}
