import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[elementHTML]'
})
export class ElementHTMLDirective implements OnChanges {
    @Input() elementHTML?: HTMLElement;

    constructor(private el: ElementRef) { }

    ngOnChanges() {
        this.el.nativeElement.replaceChildren();

        if (this.elementHTML) {
            this.el.nativeElement.appendChild(this.elementHTML);
        }
    }
}