import { AfterViewInit, Directive, ElementRef, Input } from "@angular/core";

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

    setInterval(() => {
      input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '۲' }));
    }, 1000);

    input.addEventListener('keydown', (e: KeyboardEvent) => {
      const input = e.target as HTMLInputElement;
      const replaced = toEnglishDigits(input.value);
      if (input.value !== replaced) {
        input.value = replaced;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const englishNumber = e.key.replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
        .replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

      if (e.key != englishNumber) {
        e.preventDefault();
        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: englishNumber }));
      }
    });
  }
  insertAtCursor(input: HTMLInputElement, text: string) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;

    input.value =
      input.value.slice(0, start) +
      text +
      input.value.slice(end);

    const newCursorPosition = start + text.length;

    input.setSelectionRange(
      newCursorPosition,
      newCursorPosition
    );

    input.focus();
  }
}