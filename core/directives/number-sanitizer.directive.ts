import {AfterViewInit, Directive, ElementRef} from "@angular/core";

function toEnglishDigits(input: string): string {
    return input.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (d) => {
      const code = d.charCodeAt(0);
      if (code >= 0x06F0 && code <= 0x06F9) {
        return String(code - 0x06F0);
      } else if (code >= 0x0660 && code <= 0x0669) {
        return String(code - 0x0660);
      }
      return d;
    });
  }

@Directive({
    selector: '[numberSanitizer]',
    standalone: true,
})

export class NumberSanitizerDirective implements AfterViewInit {
    constructor(private elementRef: ElementRef) {
    }
    
    ngAfterViewInit(): void {
        const el = this.elementRef.nativeElement as HTMLInputElement;
        const input = el.tagName === 'INPUT' ? el : el.querySelector('input') as HTMLInputElement;
        if (!input || input.tagName !== 'INPUT') return;

        input.addEventListener('input', (event: Event) => {
            const input = event.target as HTMLInputElement;
            const replaced = toEnglishDigits(input.value);
            if(input.value !== replaced) {
                input.value = replaced;
                input.dispatchEvent(new Event('input'));
            }
        });
    }
}