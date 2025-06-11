import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { SlidesVideoComponent } from '@/main/resources/slides/slides-video/slides-video.component';

@Component({
  selector: 'app-chat-video',
  templateUrl: './chat-video.component.html',
  styleUrls: ['./chat-video.component.scss'],
})
export class ChatVideoComponent implements OnInit {
  @Input() videoUrl!: string;
  @ViewChild('video', { static: false }) iframeRef!: ElementRef;
  dataLoaded = false;
  constructor(private dialog: MatDialog, private element: ElementRef) {}

  videoPlayer!: any;
  srcWidth!: any;
  ngOnInit() {
    this.getScreenSize();
  }

  ngAfterViewInit() {
    this.videoPlayer = this.element.nativeElement.querySelectorAll('.video');
    this.videoPlayer[0].setAttribute('style', 'margin-top:10px');
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.srcWidth = window.innerWidth;
  }

  openDialog() {
    this.videoPlayer[0].setAttribute('style', 'display:none');
    let dialogRef;
    if (this.srcWidth <= 576) {
      dialogRef = this.dialog.open(SlidesVideoComponent, {
        height: '90vh',
        width: '99vw',
        maxWidth: '99vw',
        panelClass: 'slide-video',
        autoFocus: false,
        data: {
          videoUrl: this.videoUrl + '?autoplay=1&enablejsapi=1',
          btnText: 'Back to Chatbot',
          instruction: '',
          fromChatbot: true,
        },
      });
    } else {
      dialogRef = this.dialog.open(SlidesVideoComponent, {
        height: '80vh',
        width: '70vw',
        panelClass: 'slide-video',
        autoFocus: false,
        data: {
          videoUrl: this.videoUrl + '?autoplay=1&enablejsapi=1',
          btnText: 'Back to Chatbot',
          instruction: '',
          fromChatbot: true,
        },
      });
    }
    this.onDialogRefClosed(dialogRef);
  }

  onDialogRefClosed(dialogRef: any) {
    dialogRef.afterClosed().subscribe((result: any) => {
      this.videoPlayer[0].setAttribute('style', 'display:inline-flex');
    });
  }
}
