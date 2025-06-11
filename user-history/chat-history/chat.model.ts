import { Button } from './button.model';

// Using the original Chat model from the existing codebase
export class Chat {
  constructor(
    public message: string,
    public user: boolean,
    public buttons: Button[],
    public mid: string,
    public sid: string,
    public datetime: Date,
    public waiting: boolean,
    public widgets: string[],
    public embed_links: any,
    public msg_time: any,
    public show_simple_mood_tracker: boolean = false,
    public show_checkbox: boolean = false,
    public textbox_with_btn_or_widget: boolean = false,
    public start_cognitive_strategy_game: boolean = false,
    public show_image_slider: boolean = false,
    public show_audio_message: boolean = false,
    public play_audio_message: boolean = false,
    public safety_bubble_message: boolean = false,
    public show_selected_module_button: boolean = false,
    public resources: any = {}
  ) {}
}

// Simplified version for easier rendering if needed
export class SimpleChatMessage {
  constructor(
    public id: string,
    public content: string,
    public isUser: boolean,
    public timestamp: Date,
    public attachments: any[] = []
  ) {}
}