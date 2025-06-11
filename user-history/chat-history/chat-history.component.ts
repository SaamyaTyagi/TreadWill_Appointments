import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from './chat.model';
import { HttpClientModule } from '@angular/common/http';
import { ChatHistoryService } from './chat-history.service';

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.css'],
  providers: [ChatHistoryService]
})
export class ChatHistoryComponent implements OnInit {
  @Input() nickname: string = '';
  messages: Chat[] = [];
  isLoading: boolean = true;

  constructor(private chatHistoryService: ChatHistoryService) {}

  ngOnInit(): void {
    // Load chat history for the user
    this.loadChatHistory();

    // Add a small timeout to ensure the spinner is visible for a moment
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  loadChatHistory(): void {
    // Get chat history from the service
    this.chatHistoryService.getChatHistory(this.nickname).subscribe({
      next: (data) => {
        this.messages = data;
        console.log('Loaded chat messages:', this.messages);
      },
      error: (error) => {
        console.error('Error loading chat history:', error);
        this.isLoading = false;
      }
    });
  }

  isDifferentDay(messageIndex: number): boolean {
    if (messageIndex === 0) {
      return false; // We're always showing "Today" as the first separator
    }

    const d1 = new Date(this.messages[messageIndex - 1].datetime);
    const d2 = new Date(this.messages[messageIndex].datetime);

    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  }

  getMessageDate(messageIndex: number): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const messageDate = new Date(this.messages[messageIndex].datetime);

    if (this.isSameDay(messageDate, today)) {
      return 'Today';
    } else if (this.isSameDay(messageDate, yesterday)) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}