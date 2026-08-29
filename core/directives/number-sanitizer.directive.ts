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


    input.addEventListener('keydown', (e: KeyboardEvent) => {
      const replaced = toEnglishDigits(input.value);
      if (input.value !== replaced) {
        input.value = replaced;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const persianIndex = "۰۱۲۳۴۵۶۷۸۹".indexOf(e.key);
      const arabicIndex = "٠١٢٣٤٥٦٧٨٩".indexOf(e.key);

      let englishNumber = e.key;
      if (persianIndex > -1) englishNumber = String(persianIndex);
      else if (arabicIndex > -1) englishNumber = String(arabicIndex);

      if (e.key != englishNumber) {
        e.preventDefault();
        typeText(input, englishNumber);
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

function typeText(element: HTMLInputElement, char: string, delay: number = 50) {
  element.focus();

  element.dispatchEvent(new KeyboardEvent("keydown", {
    key: char,
    code: `Key${char.toUpperCase()}`,
    bubbles: true,
    cancelable: true
  }));

  element.dispatchEvent(new InputEvent("beforeinput", {
    inputType: "insertText",
    data: char,
    bubbles: true,
    cancelable: true
  }));

  // تغییر مقدار واقعی
  const start = element.selectionStart ?? element.value.length;
  const end = element.selectionEnd ?? element.value.length;

  element.setRangeText(char, start, end, "end");

  element.dispatchEvent(new InputEvent("input", {
    inputType: "insertText",
    data: char,
    bubbles: true
  }));

  element.dispatchEvent(new KeyboardEvent("keyup", {
    key: char,
    code: `Key${char.toUpperCase()}`,
    bubbles: true
  }));
}
