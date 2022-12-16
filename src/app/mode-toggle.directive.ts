import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MouseButton, Point, TileEventType } from './types';

@Directive({
  selector: '[appModeToggle]',
})
export class ModeToggleDirective {
  @Output() onEngageTile: EventEmitter<[TileEventType, Point]>;

  @Input() position: Point;
  
  @HostListener('mouseup', ['$event'])
  submit(event: MouseEvent) {
    console.log('Ack:', event.button);
    
    const tileEvent = event.button === MouseButton.PRIMARY ? 'X' : 'F';
    this.onEngageTile.emit([tileEvent, this.position]);
    event.preventDefault();
  }
  constructor(private el: ElementRef) {
    this.onEngageTile = new EventEmitter<[TileEventType, Point]>();
  }

}
