import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appChatImage]',
})
export class ChatImageDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
