import {
  CHATBOT_RETRY_TIMEOUT,
  FORM_START_VIA_CHAT_BOT_SCORE,
  MAX_RETRIES, MAXIMISE_CHAT,
  MOBILE_WIDTH,
  NEW_CHAT,
  REPLY_CURRENT,
  RESUME_CHAT,
} from '@/app.constants';
import { Chat } from '@/main/chatbot/chat.model';
import { ChatbotService } from '@/main/chatbot/chatbot.service';
import { AuthService } from '@/shared/auth/auth.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';
import { NavbarNotificationsService } from '@/main/shared/navbar/navbar-notifications.service';
import { CustomOverlayService } from '@/main/shared/custom-overlay/custom-overlay.service';
import { CommonService } from '@/shared/common.service';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {MatMenuTrigger} from '@angular/material/menu';
import {Router} from '@angular/router';
import {Button} from '@/main/chatbot/chat-window/button.model';
import {PuzzleSoundService} from "@/main/games/games-list/common-game/effigy-game/puzzle-sound.service";


declare var twemoji: any;

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          visibility: 'visible',
          transform: 'translateY(0%)',
        }),
      ),
      state(
        'closed',
        style({
          visibility: 'hidden',
          transform: 'translateY(0%)',
        }),
      ),
      state(
        'animateOpen',
        style({
          transform: 'translateY(0%)',
        }),
      ),
      transition('open => closed', [animate('0.5s linear')]),
      transition('closed => open', [animate('0.5s linear')]),
      transition('void => animateOpen', [
        style({ transform: 'translateY(100%)' }),
        animate('500ms', style({ transform: 'translateY(0%)' })),
      ]),
      transition('animateOpen => *', [
        animate('500ms', style({ transform: 'translateY(100%)' })),
      ]),
    ]),
  ],
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  constructor(
    private chatbotService: ChatbotService,
    private authService: AuthService,
    private changRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private overlayService: CustomOverlayService,
    private notificationService: NavbarNotificationsService,
    private elementRef: ElementRef,
    private commonService: CommonService,
    private renderer: Renderer2,
    private router: Router,
    private puzzleSound: PuzzleSoundService,

  ) {
    this.commonService.isOnline$().subscribe((isOnline: boolean) => {
      this.isOnline = isOnline;
    });
  }

  messages: Chat[] = [];
  message = '';
  webSocket!: WebSocket;
  buttons: any = [];
  scrollTop = 0;
  totalDelay = 3000;
  delayPerWord = 50;
  chatClosed = false;
  retries = 0;
  showMoodTracker = false;
  showSimpleMoodTracker = false;
  showDateTime = false;
  moodWidget = 'mood_widget';
  dateTimeWidget = 'date_time_widget';
  ratingWidget = 'rating_widget';
  radio = 'radio';
  hyperlink = 'hyperlink';
  clickAble = 'clickable_image';
  buttonType = '';
  images: any[] = [];
  isOnline = true;
  @ViewChild('messagesDiv', { static: false }) messagesDiv!: ElementRef;
  @ViewChild('ti', { static: false }) ti!: ElementRef;
  @Input() overlayOpen!: boolean;
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;
  @Input() chatWindowClosed = true;
  @Input() chatMinimised = false;
  @Output() chatWindowClosedEmitter = new EventEmitter<Boolean>();
  @ViewChild('closeMenuTrigger', {static: false}) closeMenuTrigger!: MatMenuTrigger;
  // @ViewChild('moodDiv', { static: false }) moodDiv!: ElementRef;
  counter = 4;
  showMore = false;
  showModuleButtons = false;
  chatButtons: any[] = [];
  buttonsBuffer = [];
  widgetValues!: any;
  showMoodWidgetBtn = false;
  showDateTimeWidgetBtn = false;
  showMaintenance = false;
  showSpinner = false;
  isMultiLineInput = false;
  showTextInput!: boolean;
  timeout: any = null;
  page!: number;
  allMessagesLoaded = false;
  mobileView!: boolean;
  @Input() currentDateTime!: any;
  isLoading = false;
  multiLineChat: string[] = [];
  showSlider = false;
  widgetRating = 0;
  showScrollToBottom = false;
  @ViewChild('frameContainer', { static: false }) frameRef!: ElementRef;
  @ViewChild('tooltip', { static: false }) showToolTip!: MatTooltip;
  tooltipData!: any;
  msgReceived = 'Please switch back to portrait mode for better experience';
  action = '';
  currentModule!: string;
  messageDateString!: string;
  messageTime!: string;
  showWillBotTyping = false;
  height = 0;
  MULTILINEINPUT_DELAY = 4000;
  MESSAGES_DELAY = 2500;
  RESOURCES_DELAY = 2500; // TO CHECK
  PUSHCHAT_DELAY = 1500;
  MIN_SCROLL_DELAY = 100;
  SCROLL_DELAY = 500;
  DElAY_PER_WORD_BUTTON = 250;
  FOCUS_DELAY = 200;
  MINIMISE_CHAT = 'MIN CHAT';
  // chatMinimised = false;
  minChatTime = 0;
  minimisedDuration = 0;
  maxMinimisedDuration = 60; // time in seconds // needs to be changed
  chatMinSub!: Subscription;
  chatMinimisedTimer!: any;
  showtoolTip = false;
  chatResumed = false;
  strategyGameStarted = false;
  showNextButton = true;
  resources = <any> [];
  showCheckboxElement = false;
  start_cognitive_strategy_game = false;
  postChatSubscribe!: Subscription;
  // chatHistory = true;
  moduleName = '';
  moduleState = '';
  form_session_id!: any;
  textbox_with_btn_or_widget = false;
  show_image_slider = false;
  show_audio_message = false;  //for all imagery audios this will be true
  play_audio_message = false;   // for testing audio
  safety_bubble_message = false; // for safety bubble
  show_safe_place_imagery = false // for safe place imagery
  show_happy_child_imagery = false // for evoking happy child mode imagery
  show_visualize_future_imagery = false // for visualizing healthy adult mode imagery

  showSelectedModuleButton = false;
  show_only_positive_mood = false;  // simple mood tracker with positive mood


  // public toggleFavorite() {
  //   this.isFavorite = !this.isFavorite;
  // }

  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(event: any): void {
   this.closeChat();
  }


  // ngOnChanges(): void {
  openChatWindow() {
    console.log('MESSAGES ARRAY', this.messages);
    console.log('websocket open', this.webSocket, this.chatMinimised);
    if (!this.chatWindowClosed) {
      if (
        !this.webSocket ||
        (this.webSocket && this.webSocket.readyState === 3)
      ) {
        this.postChatSubscribe = this.chatbotService.postPreviousChat(this.currentDateTime).subscribe(
          (data: any) => {
            console.log('POST PREVIOUS CHAT DATA', data);
            if (data.status) {
              data.data.messages.forEach((message: any) => {
                if (!this.isErrorMessage(message)) {
                  // this.chatHistory = true;
                  this.start_cognitive_strategy_game = false;
                  this.showCheckboxElement = false;
                  this.resources = [];
                  this.pushCogSitutation(message);
                  this.pushImages(message);
                  this.messages.push(
                    new Chat(
                      twemoji.parse(message.text),
                      message.is_sender_user,
                      [],
                      message.mid,
                      message.sid,
                      message.datetime,
                      false,
                      [],
                      this.images,
                      message.msg_time,
                      message.show_simple_mood_tracker,
                      this.showCheckboxElement,
                      false,
                      this.start_cognitive_strategy_game,
                      this.show_image_slider,
                      this.show_audio_message,
                      this.play_audio_message,
                      this.safety_bubble_message,
                      this.showSelectedModuleButton,
                      this.resources,
                    ),
                  );
                }
              });
              console.log('START CHAT SESSION');
              this.scrollToBottom();
              setTimeout(() => {
                this.startChatSession(NEW_CHAT, this.moduleName);
              }, 500);
            }
          },
          (error: HttpErrorResponse) => {
            this.showMaintenance = true;
          },
        );
        this.initialiseChatVaraibles();
      } else {
        console.log('websocket open');
      }
    } else {
      this.closeChat();
    }
  }

  ngOnInit() {
    this.chatbotService.triggerChatbotEmitter.subscribe((val: any) => {
      if (val) {
        console.log('TRIGGER CHATBOT VALUES', val);
        this.moduleName = val.module_name;
        this.moduleState = val.module_state;
        this.form_session_id = val.resources; // To check whether adding resources here is not causing any bug
        // this.form_session_id = this.form_session_id.toString();
        this.maximiseChat();
        // this.resumeChatSession(RESUME_CHAT,  'switch_module');
      }
    });
    console.log('CHAT WINDOW INITIALISED', this.form_session_id);

    this.mobileView = window.innerWidth < MOBILE_WIDTH;

    this.chatMinSub = this.chatbotService.chatMinimiseEmitter.subscribe( (val: boolean) => {
      if (val && !this.chatMinimised) {
        this.minimiseChat();
      }
    });
    // this.chatMinimised = window.localStorage.getItem('chatMinimised') === 'true';
    // this.chatWindowClosed = window.localStorage.getItem('chatWindowClosed') === 'true';
    // this.openChatWindow(); // Checking if removing this call would affect working of bot
  }
  initialiseChatVaraibles() {
    this.tooltipData = 'Please switch back to portrait mode for better experience';
    this.showNextButton = true;
    this.chatMinimised = window.localStorage.getItem('chatMinimised') === 'true';
    this.chatWindowClosed = window.localStorage.getItem('chatWindowClosed') === 'true';
  }
   openingStyle() {
    // if (!this.overlayOpen) {
    //   return 'open';
    // } else {
      return 'animateOpen';
    // }
  }

  getRating(value: number) {
    if (value !== undefined) {
      this.widgetRating = value;
    }
  }

  onRatingSubmit() {
    this.message = 'I rate it ' + this.widgetRating + ' out of 10';
    this.widgetValues = this.widgetRating;
    this.onChatSubmit();
    this.showSlider = false;
    const height = this.frameRef.nativeElement.offsetHeight + 180;
    this.renderer.setStyle(
      this.frameRef.nativeElement,
      'height',
      `${height}px`,
    );
  }

  ngAfterViewChecked() {
    this.changRef.detectChanges();
  }
   onChatSubmit() {
     this.textbox_with_btn_or_widget = false;
     this.changRef.detectChanges();
    console.log('Resources', this.resources, this.textbox_with_btn_or_widget, this.message);
    // Show checkbox list in bullet format
    if (this.resources.length > 0) {
      // To check this code for Cognitive Strategy game
      this.resources.forEach((message: any, index: number) => {
        if (message['is_checked']) {
          if (this.message.length > 1) {
            console.log('Message', this.message);
            this.message = this.message + '<br/>' + '• ' + message['value'];
          } else {
            this.message = '• ' + message['value'];
            }
        }
      });
      console.log('Resources SUBMIT', this.message);
    }
    if (this.message.length > 0 && this.message.trim().length > 0) {
      this.message = this.message.replace(/[\n\t\r]/g, '');
      // Resetting show_checkbox to false for previous messages
      if (this.messages[this.messages.length - 1].show_checkbox) {
        this.messages[this.messages.length - 1].show_checkbox = false;
      }
        this.messages.push(
        new Chat(
          twemoji.parse(this.message),
          true,
          [],
          '',
          '',
          new Date(),
          false,
          [],
          [],
          new Date(),
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          {},
        ),
      );
      const message = this.message;
      const widgetValues = {
        payload: message,
        value: this.widgetValues,
      };
      this.message = '';
      console.log('MESSAGES ARRAY AFTER SUBMIT', this.message, 'widget values: ', this.widgetValues);

      if (this.widgetValues !== undefined) {
        console.log('send only wdiget values');
        this.webSocket.send(
          JSON.stringify({
            action: REPLY_CURRENT,
            message: {
              text: '',
              buttons: [],
              widgets: [widgetValues],
              resources: [],
            },
          }),
        );
      } else if (this.resources && message) {
        console.log('send resources and text');
        this.webSocket.send(
          JSON.stringify({
            action: REPLY_CURRENT,
            message: {
              text: message,
              buttons: [],
              widgets: [],
              resources: this.resources,
            },
          }),
        );
      } else {
        console.log('send only text');
        this.webSocket.send(
          JSON.stringify({
            action: REPLY_CURRENT,
            message: {
              text: message,
              buttons: [],
              widgets: [],
              resources: [],
            },
          }),
        );
      }
      delete this.widgetValues;
      this.resources = [];
      this.widgetRating = 0;
      this.scrollToBottom();
      this.showTextInput = false;
      this.showWillBotTyping = true;
      this.showSimpleMoodTracker = false;
      this.changRef.detectChanges();
    }
  }

  close() {
    // if (!this.overlayOpen) {
    //   this.closeChat();
    // } else {
      setTimeout(() => {
        this.closeChat();
      }, this.SCROLL_DELAY);
      // this.overlayService.closeChatbotOverlay.emit();
    // }
    // this.chatbotService.showOutsideModal = false;
  }

  ngOnDestroy(): void {
  }

  chatButtonPressed(button: any) {
    console.log('play_audio_message',  this.play_audio_message);
    if(this.play_audio_message) {
      this.puzzleSound.playParentTileAppearanceSound();
      this.play_audio_message = false;
    }
    if (button.type === 'resources') {
      if (button.link !== '') {
        // check below why it is required to reload
        // window.location.reload();
        console.log('NAVIGATE', button.link);
        this.minimiseChat();
        // check below code is set for PHQ detection, check for forms
        const myArray = button.link.split("?type=");
        console.log('NAVIGATE', myArray);
        this.router.navigate(
          [myArray[0]],
          {
            queryParams: {'type': myArray[1]},
          }
        );
        // this.router.navigate([
        //   button.link
        // ]).then(() => {
        //   // window.location.reload();
        // });
      } else {
        console.log('Send form id with this button', this.message);
        // this.message = this.form_session_id;
        button['resources'] = this.form_session_id;
        console.log('Send form id with this button', button);
      }
     }

    if (button.type === 'clickable_image') {
      // this.showSelectedModuleButton = true;
      this.resources = [];
      this.resources.push(button);
      console.log('button type clickable, button ', button, this.message);
      console.log('module button Pressed', button, this.currentModule , this.resources);
      this.messages.push(
        new Chat(
          '',
          true,
          button,
          '',
          '',
          new Date(),
          false,
          [],
          [],
          new Date(),
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true,
          this.resources,
        ),
      );
    } else {

    // if (button.type === 'resources_sharing') {
    //   //code for adding resources to the buttons
    //
    //   this.message = "pk for forms";
    //
    // }
    // this.chatHistory = false;
    // if resources module then send resources attribute
    console.log('Chat button Pressed, button', button, this.currentModule , this.resources);
      this.messages.push(
        new Chat(
          button['emojified_payload'],
          true,
          [],
          '',
          '',
          new Date(),
          false,
          [],
          [],
          new Date(),
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          '',
        ),
      );
    }
    // REMOVE SENDING DATA FOR MODULE BUTTON LIST AS BUTTONS, IT SHOULD BE SENT AS RESOURCES
    const message = this.message;
    console.log('Chat button Pressed', message );
    if (message !== '') {
      this.webSocket.send(
        JSON.stringify({
          action: REPLY_CURRENT,
          message: {
            text: '',
            buttons: [button],
            resources: message
          },
        }),
      );
      this.message = '';
    } else if (this.resources.length !== 0) {
      this.webSocket.send(
        JSON.stringify({
          action: REPLY_CURRENT,
          message: {
            text: '',
            buttons: [button],
            resources: this.resources
          },
        }),
      );
      this.message = '';
    } else  {
      this.webSocket.send(
        JSON.stringify({
          action: REPLY_CURRENT,
          message: {
            text: '',
            buttons: [button],
          },
        }),
      );
    }
    this.resources = [];
    this.chatButtons = [];
    this.textbox_with_btn_or_widget = false;
    this.showMore = false;
    this.showModuleButtons = false;
    this.showWillBotTyping = true;
  }

  scrollToBottom() {
  if (this.messagesDiv) {
      this.scrollTop = this.messagesDiv.nativeElement.scrollHeight;
      console.log(this.scrollTop, ' messagesDiv scroll top');
      this.changRef.detectChanges();
    }
    // else if (this.moodDiv) {
    //   this.moodDiv.nativeElement.scrollTop = this.moodDiv.nativeElement.scrollHeight;
    //   this.changRef.detectChanges();
    // }
  }

  onKey(event: KeyboardEvent) {
    // 576 comes from the bootstrap
    console.log('on key event');
    if (!event.shiftKey && screen.availWidth > 576) {
      this.onChatSubmit();
    }
  }

  startChatSession(type: string, module_name: string) {
    this.webSocket = new WebSocket(
      environment.CHAT_HOST + '/ws/chat/?token=' + this.authService.getToken(),
    );
    this.webSocket.onopen = event => {
      this.webSocket.send(JSON.stringify({ action: type, module_name: this.moduleName, module_state: this.moduleState}));
    };
    // this.chatHistory = false;
    this.webSocket.onmessage = (message: any) => {
      this.showMaintenance = false;
      this.chatButtons = [];
      const data = JSON.parse(message.data);
      console.log('NEXT MESSAGE', data);

      if (data.is_new_form) {
        this.commonService.updateScore(FORM_START_VIA_CHAT_BOT_SCORE);
      }
      this.currentModule = data.module_name;
      console.log('CURRENT MODULE', this.currentModule);
      if (data.error === true) {
        const item = new Chat(
          data.text,
          false,
          [],
          '',
          '',
          new Date(),
          false,
          [],
          [],
          new Date(),
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          '',
        );
        this.messages.push(item);
        this.webSocket.close();
      } else if (data.action === 'ws_close') {
        this.closeChat();
        this.overlayService.closeChatbotOverlay.emit();
        // this.chatbotService.showOutsideModal = false;
      } else {
        this.page = 1;
        this.start(data.message);
      }
    };

    this.webSocket.onclose = () => {
      console.log('websocket close from start chat session');
      if (
        !this.chatClosed &&
        this.webSocket.readyState === 3 &&
        this.retries < MAX_RETRIES
      ) {
        this.retries++;
        setTimeout(
          () => this.startChatSession(NEW_CHAT, ''),
          CHATBOT_RETRY_TIMEOUT,
        );
      }
    };

    this.webSocket.onerror = () => {
      if (this.isOnline) {
        this.showMaintenance = true;
        this.chatButtons = [];
        this.textbox_with_btn_or_widget = false;
        this.showDateTimeWidgetBtn = false;
        this.showMoodWidgetBtn = false;
      }
      this.webSocket.close();
    };
  }

  resumeChatSession(type: string, module_name: string) {
    this.webSocket.send(JSON.stringify({ action: type, module_name: module_name }));
  }

  pushChat(m: any) {
    console.log('push chat called', m );
    this.buttonsBuffer = [];
    this.pushImages(m);
    if (m.buttons) {
      m.buttons.forEach((button: any) => {
        if (!button.hasOwnProperty('emojified_payload')) {
          console.log('BUTTON', button);
          button.emojified_payload = twemoji.parse(button.payload);
        }
      });
    }
    if (m.textbox_with_btn_or_widget) {
      this.textbox_with_btn_or_widget = true;
    } else {
      this.textbox_with_btn_or_widget = false;
    }

    if (m.buttons && m.buttons.length !== 0 && m.buttons.length < 5) {
      setTimeout(() => {
        this.chatButtons = [];
        // if (m.start_cognitive_strategy_game) {
        //   setTimeout(() => {
        //   this.chatButtons = m.buttons;
        //   }, 10000);
        // } else {
          this.chatButtons = m.buttons;
        // }
        for (let i = 0; i < this.chatButtons.length; i++) {
          this.chatButtons[i].loaded = false;
        }
        if (m.buttons[0].therapy_name) {
          this.showModuleButtons = true;
        }
      }, this.getSentenceDelayButton(m.text));
    } else if (m.buttons && m.buttons.length !== 0 && m.buttons.length >= 5) {
      // this.buttonsBuffer = m.buttons;
      setTimeout(() => {
        this.chatButtons = m.buttons;
        for (let i = 0; i < this.chatButtons.length; i++) {
          this.chatButtons[i].loaded = false;
        }
        this.counter = 3;
        // this.showMore = true;
        if (m.buttons[0].therapy_name) {
          this.showModuleButtons = true;
        }
      }, this.getSentenceDelayButton(m.text));
    }
    if (Array.isArray(m.widgets) && m.widgets.length) {
      console.log('push chat widgets', m.widgets);
      if (m.widgets[0] === this.ratingWidget) {
        setTimeout(() => {
          this.showSlider = true;
          const height = this.frameRef.nativeElement.offsetHeight - 180;
          this.renderer.setStyle(
            this.frameRef.nativeElement,
            'height',
            `${height}px`,
          );
          setTimeout(() => {
            this.scrollTop = this.messagesDiv.nativeElement.scrollHeight;
            this.changRef.detectChanges();
          }, this.MIN_SCROLL_DELAY);
        }, this.getSentenceDelayButton(m.text));
      } else if (m.widgets[0] === this.moodWidget) {
        setTimeout(() => {
          this.showMoodWidgetBtn = true;
          const moodBtn = this.elementRef.nativeElement.querySelectorAll(
            '.mood-btn',
          );
          moodBtn.forEach((btn: any, index: number) => {
            if (index !== moodBtn.length - 1) {
              btn.remove();
            }
          });
        }, this.getSentenceDelayButton(m.text));
      } else {
        setTimeout(() => {
          this.showDateTimeWidgetBtn = true;
          const dateTimeBtn = this.elementRef.nativeElement.querySelectorAll(
            '.date-time-btn',
          );
          dateTimeBtn.forEach((btn: any, index: number) => {
            if (index !== dateTimeBtn.length - 1) {
              btn.remove();
            }
          });
        }, this.getSentenceDelayButton(m.text));
      }
    }

    // this.showMoodWidget = !!m.widgets;
    this.isLoading = false;
    const item = new Chat(
      twemoji.parse(m.text || ''),
      false,
      this.chatButtons,
      m.mid,
      m.sid,
      m.datetime,
      false,
      m.widgets,
      this.images,
      new Date(),
      m.show_simple_mood_tracker,
      m.show_checkbox,
      m.textbox_with_btn_or_widget,
      m.start_cognitive_strategy_game,
      m.show_image_slider,
      m.show_audio_message,
      m.play_audio_message,
      m.safety_bubble_message,
      m.show_selected_module_button,
      m.resources,
    );
    if (m.buttons && m.buttons.length > 0) {
      this.buttonType = m.buttons[0].type;
      console.log('button type', this.buttonType);
    }
    this.messages.push(item);
    console.log('Item', item);

    this.scrollToBottom();
    setTimeout(() => {
      this.scrollToBottom();
    }, this.getSentenceDelayButton(m.text) + 50);

    // this.showButtons = [];
  }

  showWritingAndPushChat(m: any) {
    setTimeout(() => {
      this.pushChat(m);
      this.scrollToBottom();
    }, this.PUSHCHAT_DELAY);
  }

  closeChat() {
    this.strategyGameStarted = false;  // check

    console.log('CLOSE CHAT CALLED', this.webSocket);
    this.chatButtons = [];
    this.showTextInput = false;
    this.showMore = false;
    this.showModuleButtons = false;
    this.moduleName = '';
    this.moduleState = '';
    this.showSlider = false;
    this.safety_bubble_message = false;
    this.play_audio_message = false;
    this.show_happy_child_imagery = false;
    this.show_visualize_future_imagery = false;
    this.show_audio_message = false;
    if (this.webSocket) {
      console.log('WEBSOCKET CLOSE CHAT CALLED');
      this.chatClosed = true;
      this.webSocket.close();
      this.page = 1;
      console.log('CLOSE websocket', this.webSocket);
      this.messages.length = 0;
      console.log('MESSAGES ARRAY', this.messages);
      if (this.postChatSubscribe) {
        this.postChatSubscribe.unsubscribe();
      }
    }
    this.retries = 0;
    this.chatWindowClosedEmitter.emit(true);
    // this.chatbotService.chatMinimiseEmitter.emit(true);
    this.chatWindowClosed = true;
    localStorage.setItem('chatWindowClosed', 'true');
    localStorage.setItem('chatMinimised', 'true');

    this.chatMinimised = true;
  }

  minimiseChat() {
    // this.chatButtons = [];
    localStorage.setItem('chatMinimised', 'true');
    this.messages[this.messages.length - 1].resources = [];

    console.log('chat minimised', this.messages[this.messages.length - 1]);
    this.retries = 0;
    this.chatWindowClosedEmitter.emit(true);
    // this.chatbotService.chatMinimiseEmitter.emit(true);
    // this.chatWindowClosed = false;
    this.chatMinimised = true;
    this.minChatTime = Date.now();
    this.showSimpleMoodTracker = false;
    this.textbox_with_btn_or_widget = false;
    this.chatMinimisedTimer = setTimeout(() => {
        this.closeChat();
        console.log('WEBSOCKET STATUS', this.webSocket);
      }, 180000 * 20);  // the chat session should close automatically after 60 mins To change value
  }


  maximiseChat() {
    localStorage.setItem('chatMinimised', 'false');
    localStorage.setItem('chatWindowClosed', 'false');
    this.showSimpleMoodTracker = false;
    clearTimeout(this.chatMinimisedTimer);
    if (this.chatWindowClosed) {
      this.chatWindowClosed = false;
      this.chatMinimised = false;
      this.openChatWindow();
    } else if (!this.chatWindowClosed) {
      this.minimisedDuration = Math.floor((Date.now() - this.minChatTime) / 60000);
      console.log('minimise duration', this.minimisedDuration);
      if (this.minimisedDuration < 5) {
        console.log('DURATION LESS THAN 5 MINUTES');
        //
      } else if (this.minimisedDuration >= 5 && this.minimisedDuration < 60) {
        console.log('DURATION BETWEEN 5 TO 60 MINUTES', this.showToolTip);
        // this.chatResumed = true;
        setTimeout(() => {
          // this.chatResumed = false;
        }, 3500);
        setTimeout(() => {
          this.resumeChatSession(RESUME_CHAT, '');
        }, 500);
        if (window.matchMedia('(orientation: landscape)').matches) {
          console.log('show tooltip');
          setTimeout(() => {
            this.tooltipShow();
          }, 500);
        }
      } else {
        console.log('DURATION MORE THAN 60 MINUTES');
      }
      // this.minimisedDuration = 0;
      this.minChatTime = 0;
      this.chatMinimised = false;
      // setTimeout(() => {
      //     this.tooltipShow();
      //    }, 500);
      this.chatWindowClosedEmitter.emit(false);
    }
  }

  getWordCount(str: string) {
    return str.split(' ').length;
  }

  getSentenceDelayButton(str: string) {
    return this.getWordCount(str) * this.DElAY_PER_WORD_BUTTON;
  }

  getSentenceDelay(str: string) {
    return this.getWordCount(str) * this.delayPerWord;
  }

  onMoodSelect() {
    this.showMoodTracker = !this.showMoodTracker;
  }

  getMoodMessage($event: any) {
    this.message = $event.moodMessage;
    this.widgetValues = $event.moodValues;
    console.log('mood values', $event);
    this.showMoodWidgetBtn = false;
  }

  getDateTimeMessage($event: any) {
    this.message = $event.dateTimeMessage;
    this.widgetValues = $event.dateTimeValues;
    this.showDateTimeWidgetBtn = false;
  }

  start(messages: any) {
    this.isMultiLineInput = !!messages[0].multiline_input;
    this.loadEachMessage(messages);
    if (messages[messages.length - 1].start_cognitive_strategy_game) {
      console.log('start cognitive strategy game');
      // To add condition for CBT or Schema therapy
      this.strategyGameStarted = true;
      this.showNextButton = false;
    } else if (messages[messages.length - 1].show_image_slider) {
      this.showNextButton = false;
    }
    else if (messages[messages.length - 1].show_audio_message) {
      this.showNextButton = false;
    }
    else if (messages[messages.length - 1].play_audio_message) {
      this.showNextButton = false;
    }
    else if (messages[messages.length - 1].safety_bubble_message) {
      this.showNextButton = false;
    }
    // for showing checkbox component
    // setTimeout(() => {
    //   if (!messages[messages.length - 1].show_checkbox) {
    //   console.log('show check box component');
    //   }
    // }, messages.length * this.MESSAGES_DELAY);

    setTimeout(() => {
      if (
        (messages[messages.length - 1].buttons &&
          messages[messages.length - 1].buttons.length === 0 &&
          messages[messages.length - 1].widgets &&
          messages[messages.length - 1].widgets.length === 0) ||
        (messages[messages.length - 1].buttons &&
          messages[messages.length - 1].buttons.length === 0 &&
          messages[messages.length - 1].widgets === undefined) ||
        messages[messages.length - 1].widgets === null
      ) {
        if (messages[messages.length - 1].show_simple_mood_tracker) {
          this.showSimpleMoodTracker = true;
          if(messages[messages.length - 1].show_positive_mood) {
            this.show_only_positive_mood = true;
          } else  {
            this.show_only_positive_mood = false;
          }
          // this.showImageSlider = true;
          console.log('showSimpleMoodTracker', messages);
        } else if (messages[messages.length - 1].show_checkbox) {
          setTimeout(() => {
            this.showCheckboxElement = true;
            setTimeout(() => {
              this.onScrollToBottomClick();   // TO CHECK
            }, this.SCROLL_DELAY);
            }, this.RESOURCES_DELAY);
          console.log('show check box component', messages.length);
        } else if (messages[messages.length - 1].show_image_slider) {
          // setTimeout(() => {
            this.show_image_slider = true;
          this.resources = messages[messages.length - 1].resources;
          console.log('show IMAGE SLIDER',  this.resources);
        }  else {
          this.showTextInput = true;
          console.log('showTextInput', messages);
        }
        setTimeout(() => {
          this.onScrollToBottomClick();   // TO CHECK
        }, this.SCROLL_DELAY);
      } else {

        if (messages[messages.length - 1].play_audio_message) {
          this.play_audio_message = true;
          // setTimeout(() => {
            console.log('showNextButton', this.play_audio_message);
            this.showNextButton = true;
          // }, 1500);
        }  else if (messages[messages.length - 1].safety_bubble_message) {
          // setTimeout(() => {
          this.safety_bubble_message = true;
          console.log('showNextButton, safety_bubble_message', this.safety_bubble_message);
        } else if (messages[messages.length - 1].show_audio_message) {
          if(messages[messages.length - 1].show_happy_child_imagery) {
            this.show_happy_child_imagery = true;
            this.show_audio_message = true;
          } else if(messages[messages.length - 1].show_visualize_future_imagery) {
            this.show_visualize_future_imagery = true;
            this.show_audio_message = true;
          }
          else  if(messages[messages.length - 1].show_safe_place_imagery) {
            this.show_safe_place_imagery = true;
            this.show_audio_message = true;

          }

          console.log('show_audio_message',  this.show_audio_message);
        }
          console.log('Dont showTextInput', messages);
          this.showTextInput = false;
      }
    }, messages.length * this.MESSAGES_DELAY );
  }

  loadEachMessage(m: any) {
    for (let index = 0; index < m.length; index++) {
      const delayPerMessage =
        (this.totalDelay + this.getSentenceDelay(m.text || '')) * index;
          console.log('DELAY MESSAGES');
      if (
        (m[index].text && m[index].text.length > 0) ||
        (m[index].buttons && m[index].buttons.length > 0) ||
        (m[index].widgets && m[index].widgets.length > 0) ||
        (m[index].embed_links)
      ) {
        setTimeout(() => {
          this.showWillBotTyping = false;
          this.isLoading = true;
          this.showWritingAndPushChat(m[index]);
          this.scrollToBottom();
        }, delayPerMessage);
      }
    }
  }

  onDateTimeSelect() {
    this.showDateTime = !this.showDateTime;
  }

  pushImages(m: any) {
    this.images = [];
    if (m.embed_links && m.embed_links.length > 0) {
      console.log('SHOW EMBED IMAGE 1');
      m.embed_links.forEach((image: any) => {
        if (image.type === 'unsplash_image') {
          console.log('SHOW EMBED IMAGE');
          this.pushUnsplashImage(image);
        } else if (image.type === 'giphy') {
          this.pushGIF(image);
        } else if (image.type === 'video') {
          this.pushVideo(image);
        } else {
          this.pushImage(image);
        }
      });
    }
  }

// checking for getting data for cog game

  pushCogSitutation(m: any) {
    // this.resources = [];
    if (m.resources.length !== 0) {
      console.log('RESOURCES EXIST', m, this.resources);
      if (m.resources[0].title && m.resources[0].history) {
        this.resources = m.resources;
        this.start_cognitive_strategy_game = true;
        console.log('SHOW RESOURCES situation', this.resources);
      }  else if (m.resources[0].card_image) {
      this.resources = m.resources;
      this.showSelectedModuleButton = true;
      console.log('showSelectedModuleButton', this.resources);
    } else if (m.resources[0].value) {
        this.resources = m.resources;
        // this.showCheckboxElement = true;
        console.log('SHOW CHECKBOX ELEMENT', this.resources);
      }
    }
  }


  pushUnsplashImage(image: any) {
    const unsplashObject = {
      type: 'image',
      url: image.static_url,
      link: image.creator_link,
      name: image.creator,
      credits: true,
    };
    this.images.push(unsplashObject);
  }

  pushImage(photo: any) {
    const image = {
      type: 'image',
      url: photo.url,
      credits: false,
    };
    this.images.push(image);
  }

  pushGIF(image: any) {
    const gifObject = {
      type: 'image',
      url: image.static_url,
      dynamic_url: image.dynamic_url,
      static_url: image.static_url,
      creditsGIF: true,
    };
    this.images.push(gifObject);
  }
  pushVideo(image: any) {
    const videoObject = {
      url: image.url,
      type: 'video',
    };
    this.images.push(videoObject);
  }

  scrollFrame(value: string) {
    if (value === 'up' && !this.allMessagesLoaded) {
      this.showSpinner = true;
      this.page += 1;
      this.chatbotService
        .loadPreviousChat(this.page, this.currentDateTime)
        .subscribe((data: any) => {
          this.showSpinner = true;
          if (data.status) {
            if (data.data.messages.length === 0) {
              this.allMessagesLoaded = true;
              this.showSpinner = false;
            }
            const firstMessageBox = this.messagesDiv.nativeElement.querySelectorAll(
              '.message-text',
            );
            data.data.messages.reverse().forEach((message: any) => {
              if (!this.isErrorMessage(message)) {
                console.log('LOAD PREVIOUS CHAT DATA', data);
                this.start_cognitive_strategy_game = false;
                this.showCheckboxElement = false;
                this.resources = [];
                this.pushCogSitutation(message);
                this.pushImages(message);
                this.messages.unshift(
                  new Chat(
                    twemoji.parse(message.text),
                    message.is_sender_user,
                    [],
                    message.mid,
                    message.sid,
                    message.datetime,
                    false,
                    [],
                    this.images,
                    message.msg_time,
                    message.show_simple_mood_tracker,
                    this.showCheckboxElement,
                    false,
                    this.start_cognitive_strategy_game,
                    this.show_image_slider,
                    this.show_audio_message,
                    this.play_audio_message,
                    this.safety_bubble_message,
                    this.showSelectedModuleButton,
                    this.resources,
                    // this.show_image_slider,
                  ),
                );

                this.showSpinner = false;
                firstMessageBox[0].scrollIntoView();
              }
            });
          }
        });
    }
  }

  getButtons() {
    this.chatButtons = this.buttonsBuffer;
    for (let i = 4; i < this.chatButtons.length; i++) {
      this.chatButtons[i].loaded = false;
    }
    this.showMore = false;
    this.showModuleButtons = false;
    setTimeout(() => {
      this.scrollToBottom();
    }, this.MIN_SCROLL_DELAY);
  }

  getTextAreaHeight() {
    if (this.textArea) {
      return this.textArea.nativeElement.offsetHeight;
    } else {
      return 0;
    }
  }
  getFrameHeight() {
    return window.innerHeight - 15;
  }
  //
  sendReply(event: any) {
    window.clearTimeout(this.timeout);
    if (event.key === 'Enter') {
      this.textbox_with_btn_or_widget = false;
      this.showTextInput = false;
      this.changRef.detectChanges();
      this.message = this.message.replace(/[\n\t\r]/g, '');
      console.log('key up event, this.textbox_with_btn_or_widget', event, this.message, this.textbox_with_btn_or_widget, this.showTextInput);
      this.showSimpleMoodTracker = false;


      this.messages.push(
        new Chat(
          twemoji.parse(this.message),
          true,
          [],
          '',
          '',
          new Date(),
          false,
          [],
          [],
          new Date(),
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          {},
        ),
      );
      this.multiLineChat.push(this.message);
      this.message = '';
      setTimeout(() => {
        this.onScrollToBottomClick();
      }, this.MIN_SCROLL_DELAY);
      this.timeout = setTimeout(
        () => {
          this.submitMultiLineChat(this.multiLineChat);
          this.isMultiLineInput = false;
        },
        this.isMultiLineInput ? this.MULTILINEINPUT_DELAY : 0,
      );
    }
  }

  submitMultiLineChat(multiLineChat: string[]) {
    this.webSocket.send(
      JSON.stringify({
        action: REPLY_CURRENT,
        message: {
          text: multiLineChat,
          buttons: [],
          widgets: [],
          resources: [],
        },
      }),
    );
    this.showTextInput = false;
    this.multiLineChat = [];
    this.onScrollToBottomClick();
  }

  onScrollToBottomClick() {
    if (this.messagesDiv) {
      this.messagesDiv.nativeElement.scrollTop = this.messagesDiv.nativeElement.scrollHeight;
      this.changRef.detectChanges();
    }
  }

  atBottom(value: boolean) {
    this.showScrollToBottom = value;
  }

  isErrorMessage(message: any): boolean {
    const errorMessage = 'ERRORINTHEBACKEND.CHECKANDRELOAD';
    const stripMessageText = message.text.replace(/\s+/g, '');
    return errorMessage === stripMessageText;
  }
  onFocusEvent(event: any) {
    setTimeout(() => {
      this.scrollToBottom();
    }, this.FOCUS_DELAY);
  }

  isDifferentDay(messageIndex: number): boolean {
    if (messageIndex === 0) {
      return true;
    }

    const d1 = new Date(this.messages[messageIndex - 1].msg_time);
    const d2 = new Date(this.messages[messageIndex].msg_time);

    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  }
  sessionStart(message: any): boolean {
    if (message.message === 'Hey, it\'s good to see you again.') {
      return true;
    } else {
      return false;
    }
  }

  getMessageDate(messageIndex: number): string {
    const dateToday = new Date();
    const longDateYesterday = new Date();
    longDateYesterday.setDate(new Date().getDate() - 1);
    const today = moment(dateToday).format('YYYYMMDDHHmmss');
    const yesterday = moment(longDateYesterday).format('YYYYMMDDHHmmss');

    const wholeDate = new Date(
      this.messages[messageIndex].msg_time,
    ).toDateString();

    this.messageDateString = moment(
      this.messages[messageIndex].msg_time,
    ).format('DD MMM YYYY');
    this.messageTime = moment(
      this.messages[messageIndex].msg_time,
    ).format('hh:mm a');

    if (this.messageDateString === today) {
      return 'Today' + ' at ' + this.messageTime;
    } else if (this.messageDateString === yesterday) {
      return 'Yesterday' + ' at ' + this.messageTime;
    } else {
      return this.messageDateString + ' at ' + this.messageTime;
    }
  }

  imageLoaded(index: number) {
    this.chatButtons[index].loaded = true;
  }
  tooltipShow() {
    if (this.showToolTip.disabled) {
      this.showToolTip.disabled = false;
    }
    this.showToolTip.showDelay = 100;
    this.showToolTip.hideDelay = 100;
    this.showToolTip.toggle();
  }
  simpleMoodTrackerValues($event: any) {
    this.message = $event.moodMessage;
    this.widgetValues = $event.moodValues;
    this.showSimpleMoodTracker = false;
  }
  showNextGame() {
    this.showNextButton = true;
    console.log('showNextGame');
    setTimeout(() => {
      this.scrollToBottom();
    }, 4500);
  }
  showNextMessage() {
    setTimeout(() => {

      this.showNextButton = true;
      setTimeout(() => {

        this.scrollToBottom();

      }, 500);

    }, 1500);
  }
  getGameMessage(event: any) {
    this.message = event;
    console.log('showNextSituation', event);
  }
  getFormMessage(event: any) {
    this.resources = event;
    console.log('Form data', event, this.messages);
    this.showCheckboxElement = false;
    if (event) {
      this.onChatSubmit();
    }
  }
  openMenu() {
    this.closeMenuTrigger.openMenu();
  }

  closeMenu() {
    this.closeMenuTrigger.closeMenu();
  }
  switchModule() {
    this.closeMenuTrigger.closeMenu();
    this.resumeChatSession(RESUME_CHAT, 'switch_module');
  }
  chatModuleCardClicked(event: any) {
    console.log('event', event);
    this.chatButtonPressed(event);

  }
}
