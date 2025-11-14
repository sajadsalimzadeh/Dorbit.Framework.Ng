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
                    const isInput = (this.el.nativeElement.tagName === 'INPUT' || this.el.nativeElement.tagName === 'TEXTAREA');
                    const input = isInput ? this.el.nativeElement : this.el.nativeElement.querySelector('input, textarea');
                    if (input) input.focus();
                }, (typeof this.pAutoFocusWithTimout === 'number' ? this.pAutoFocusWithTimout : 500));
            }
        }
    }
}