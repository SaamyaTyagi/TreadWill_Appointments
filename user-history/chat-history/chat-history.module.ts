import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatHistoryComponent } from './chat-history.component';
import { ChatMessageItemComponent } from './chat-message-item/chat-message-item.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatHistoryService } from './chat-history.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ChatHistoryComponent,
    ChatMessageItemComponent
  ],
  exports: [
    ChatHistoryComponent
  ],
  providers: [
    ChatHistoryService
  ]
})
export class ChatHistoryModule { }