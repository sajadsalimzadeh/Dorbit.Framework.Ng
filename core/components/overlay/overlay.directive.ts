import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {OverlayOptions, OverlayRef, OverlayService} from './overlay.component'

@Directive({
    standalone: false,
    selector: '[dOverlay]'
})
export class OverlayDirective {
    @Input('dOverlay') options!: OverlayOptions;
    overlayRef?: OverlayRef;

    constructor(private overlayService: OverlayService, private elementRef: ElementRef) {
    }

    @HostListener('focus', ['$event']) onFocus(e: Event) {
        e.stopPropagation();
        this.create();
    }

    @HostListener('click', ['$event']) onClick(e: Event) {
        e.stopPropagation();
        this.create();
    }

    create() {
        if (this.overlayRef) return;
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
