import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Chat } from './chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  // Replace with your actual API URL when available
  //private apiUrl = 'https://api3.treadwill.org:8004/api/v1/docs_portal/chat_history';

  constructor(private http: HttpClient) {}

  getChatHistory(nickname: string): Observable<Chat[]> {
    // For now, return mock data since the real API isn't implemented yet
    // In a real scenario, you would make an HTTP request like:
    // return this.http.get<any>(`${this.apiUrl}/${nickname}`)
    //   .pipe(
    //     map(response => this.transformResponseToMessages(response)),
    //     catchError(error => {
    //       console.error('Error fetching chat history:', error);
    //       return throwError(() => new Error('Failed to fetch chat history'));
    //     })
    //   );

    // Mock data for now
    return this.getMockChatHistory(nickname);
  }

  private getMockChatHistory(nickname: string): Observable<Chat[]> {
    const today = new Date();

    // Create mock data that matches the screenshot
    const mockData: Chat[] = [
      new Chat(
        'Hello...',
        false, // bot message
        [],
        '1',
        'sid1',
        today,
        false,
        [],
        [], // Empty embed_links array - no placeholder images
        today,
        false, // show_simple_mood_tracker
        false, // show_checkbox
        false, // textbox_with_btn_or_widget
        false, // start_cognitive_strategy_game
        false, // show_image_slider
        false, // show_audio_message
        false, // play_audio_message
        false, // safety_bubble_message
        false, // show_selected_module_button
        {}     // resources
      ),
      new Chat(
        'I am WillBot, your therapy buddy',
        false, // bot message
        [],
        '2',
        'sid1',
        today,
        false,
        [],
        [], // Empty embed_links array - no placeholder images
        today,
        false, // show_simple_mood_tracker
        false, // show_checkbox
        false, // textbox_with_btn_or_widget
        false, // start_cognitive_strategy_game
        false, // show_image_slider
        false, // show_audio_message
        false, // play_audio_message
        false, // safety_bubble_message
        false, // show_selected_module_button
        {}     // resources
      ),
      new Chat(
        'Hello WillBot 😊',
        true, // user message
        [],
        '3',
        'sid1',
        today,
        false,
        [],
        [], // Empty embed_links array - no placeholder images
        today,
        false, // show_simple_mood_tracker
        false, // show_checkbox
        false, // textbox_with_btn_or_widget
        false, // start_cognitive_strategy_game
        false, // show_image_slider
        false, // show_audio_message
        false, // play_audio_message
        false, // safety_bubble_message
        false, // show_selected_module_button
        {}     // resources
      )
    ];

    console.log('Returning mock data:', mockData);
    return of(mockData);
  }

  // This method would be used for transforming API responses
  private transformResponseToMessages(response: any): Chat[] {
    return response.data.map((item: any) => {
      return new Chat(
        item.text,
        item.is_sender_user,
        item.buttons || [],
        item.mid,
        item.sid,
        new Date(item.datetime),
        false,
        item.widgets || [],
        [], // Explicitly not using any embed_links to avoid placeholder issues
        new Date(item.msg_time || item.datetime),
        item.show_simple_mood_tracker || false,
        item.show_checkbox || false,
        item.textbox_with_btn_or_widget || false,
        item.start_cognitive_strategy_game || false,
        item.show_image_slider || false,
        item.show_audio_message || false,
        item.play_audio_message || false,
        item.safety_bubble_message || false,
        item.show_selected_module_button || false,
        item.resources || {}
      );
    });
  }
}