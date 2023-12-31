import {Directive, HostListener, Injector, Input, OnInit} from '@angular/core';
import {OverlayRef, OverlayService} from "./overlay.service";
import {OverlayOptions} from './overlay.component'
import {AbstractComponent} from "../abstract.component";

@Directive({
  selector: '[dOverlay]'
})
export class OverlayDirective extends AbstractComponent implements OnInit {
  @Input('dOverlay') options!: OverlayOptions;

  @HostListener('focus', ['$event']) onFocus(e: Event) {
    e.stopPropagation();
    this.create();
  }
  @HostListener('click', ['$event']) onClick(e: Event) {
    e.stopPropagation();
    this.create();
  }

  overlayRef?: OverlayRef;

  constructor(injector: Injector, private overlayService: OverlayService) {
    super(injector);
  }

  create() {
    if(this.overlayRef) return;
    this.overlayRef = this.overlayService.create({
      autoClose: true,
      ...this.options,
      ref: this.elementRef.nativeElement,
    });
    this.overlayRef.onDestroy.subscribe(() => {
      this.overlayRef = undefined;
    });
  }
}
