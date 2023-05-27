import {Directive, HostListener, Injector, Input, OnInit, TemplateRef} from '@angular/core';
import {BaseComponent} from "../base.component";
import {OverlayRef, OverlayService} from "./overlay.service";
import {OverlayOptions} from './overlay.component'

@Directive({
  selector: '[dOverlay]'
})
export class OverlayDirective extends BaseComponent implements OnInit {
  @Input('dOverlay') options!: OverlayOptions;

  @HostListener('click', ['$event']) onClick(e: MouseEvent) {
    e.stopPropagation();
    if(this.overlayRef) return;
    this.overlayRef = this.overlayService.create({
      ...this.options,
      autoClose: true,
      ref: this.elementRef.nativeElement,
    });
    this.overlayRef.onDestroy.subscribe(() => {
      this.overlayRef = undefined;
    });
  }

  overlayRef?: OverlayRef;

  constructor(injector: Injector, private overlayService: OverlayService) {
    super(injector);
  }
}
