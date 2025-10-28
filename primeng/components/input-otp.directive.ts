import { AfterViewInit, Directive, ElementRef, Input } from "@angular/core";

@Directive({
    standalone: true,
    selector: "p-input-otp[inputmode]",
})
export class InputOtpDirective implements AfterViewInit {
    @Input() inputmode: "numeric" | "tel" = "numeric";

    constructor(private el: ElementRef) {}

    ngAfterViewInit(): void {
        this.el.nativeElement.querySelector('input').setAttribute("autocomplete", 'one-time-code');
        this.el.nativeElement.querySelectorAll('input').forEach((input: HTMLInputElement) => {
            input.setAttribute("inputmode", this.inputmode);
        });
    }
}