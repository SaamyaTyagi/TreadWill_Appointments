import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '../chat.model';
import moment from 'moment';

@Component({
  selector: 'app-chat-message-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message-item.component.html',
  styleUrls: ['./chat-message-item.component.css']
})
export class ChatMessageItemComponent {
  @Input() message!: Chat;

  getFormattedTime(date: Date): string {
    return moment(date).format('h:mm A');
  }

  hasAttachments(): boolean {
    return this.message.embed_links && this.message.embed_links.length > 0;
  }
}