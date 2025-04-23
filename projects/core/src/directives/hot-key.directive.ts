import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
    standalone: true,
    selector: '[dHotKey]',
})
export class HotKeyDirective {
    @Input({required: true, alias: 'dHotKey'}) key!: string;

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('window:keydown', ['$event'])
    onWindowKeyDown(e: KeyboardEvent) {
        if (e.key == this.key) {
            this.elementRef.nativeElement.click();
        }
    }
}
