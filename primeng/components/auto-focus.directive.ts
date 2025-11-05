import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Directive({
    standalone: false,
    selector: '[pAutoFocusWithTimout]',
})
export class AutoFocusDirective implements OnChanges {
    @Input() pAutoFocusWithTimout: boolean | number = false;

    constructor(private el: ElementRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['pAutoFocusWithTimout']) {
            if (this.pAutoFocusWithTimout) {
                setTimeout(() => {
                    this.el.nativeElement.focus();
                }, (typeof this.pAutoFocusWithTimout === 'number' ? this.pAutoFocusWithTimout : 500));
            }
        }
    }
}