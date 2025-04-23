import {Directive, ElementRef, HostListener, Input, TemplateRef, ViewChild} from '@angular/core';
import {OverlayAlignments, OverlayRef, OverlayService} from "../components/overlay/overlay.component";
import {Colors} from "../types";

@Directive({
    standalone: true,
    selector: '[dTooltip]',
})
export class TooltipDirective {
    @Input('dTooltip') text?: string;
    @Input('dTooltipAlignment') alignment: OverlayAlignments = 'bottom-center';
    @Input('dTooltipColor') color: Colors = 'gray-4';
    @Input('dTooltipStyle') styles: any;

    @ViewChild('defaultTemplate') defaultTemplate!: TemplateRef<any>
    private overlayRef?: OverlayRef;

    constructor(private elementRef: ElementRef, private overrideService: OverlayService) {
    }

    @HostListener('mouseenter', ['$event'])
    onEnter(e: MouseEvent) {
        e.stopPropagation();
        this.show();
    }

    @HostListener('mouseleave', ['$event'])
    onLeave(e: MouseEvent) {
        this.hide();
    }

    show() {
        if (this.overlayRef) return;
        const classes: any = {};
        classes['d-tooltip-overlay'] = true;
        classes[this.alignment] = true
        classes[this.color] = true

        this.overlayRef = this.overrideService.create({
            text: this.text,
            ngClass: classes,
            styles: this.styles,
            color: this.color,
            alignment: this.alignment,
            ref: this.elementRef.nativeElement,
        });
        this.overlayRef.onDestroy.subscribe(() => {
            this.overlayRef = undefined;
        });
    }

    hide() {
        this.overlayRef?.destroy();
    }
}
