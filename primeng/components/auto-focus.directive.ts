import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Directive({
    standalone: false,
    selector: '[pAutoFocus]',
})
export class AutoFocusDirective implements OnChanges {
    @Input() pAutoFocus: boolean | number = false;

    constructor(private el: ElementRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['pAutoFocus']) {
            if (this.pAutoFocus) {
                setTimeout(() => {
                    this.el.nativeElement.focus();
                }, (typeof this.pAutoFocus === 'number' ? this.pAutoFocus : 500));
            }
        }
    }
}