import {Directive, HostListener, Injector, Input, OnInit} from '@angular/core';
import {OverlayOptions, OverlayRef, OverlayService} from './overlay.component'
import {AbstractComponent} from "../abstract.component";

@Directive({
    standalone: true,
    selector: '[dOverlay]'
})
export class OverlayDirective extends AbstractComponent implements OnInit {
    @Input('dOverlay') options!: OverlayOptions;
    overlayRef?: OverlayRef;

    constructor(injector: Injector, private overlayService: OverlayService) {
        super(injector);
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
