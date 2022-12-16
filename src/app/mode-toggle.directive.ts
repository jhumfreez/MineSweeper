import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appModeToggle]',
})
export class ModeToggleDirective {
  @HostListener('click', ['$event'])
  submit(event: MouseEvent) {
    console.log('Ack:', event.button);
  }
  constructor(private el: ElementRef) {}
}
