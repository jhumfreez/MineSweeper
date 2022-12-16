import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appModeToggle]',
})
export class ModeToggleDirective {
  @HostListener('mouseup', ['$event'])
  submit(event: MouseEvent) {
    console.log('Ack:', event.button);
    event.preventDefault();
  }
  constructor(private el: ElementRef) {}
}
