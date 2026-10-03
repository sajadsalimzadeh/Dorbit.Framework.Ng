import { AfterViewInit, Directive, ElementRef, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { InputNumber } from 'primeng/inputnumber';

function normalizeNumber(input: string): string {
  return input.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, digit => {
    const code = digit.charCodeAt(0);
    return String(code - (code >= 0x06F0 ? 0x06F0 : 0x0660));
  }).replace(/\u066B/g, '.').replace(/\u066C/g, ',');
}

@Directive({
  selector: '[numberSanitizer], p-input-number, p-inputnumber, p-inputNumber',
  standalone: true,
})
export class NumberSanitizerDirective implements OnInit, AfterViewInit, OnDestroy {
  private readonly removeListeners: (() => void)[] = [];

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() private readonly inputNumber: InputNumber | null,
  ) {}

  ngOnInit(): void {
    // Keep the default parser independent of the phone language.
    if (this.inputNumber && !this.inputNumber.locale) {
      this.inputNumber.locale = 'en-US';
      this.inputNumber.constructParser();
    }
  }

  ngAfterViewInit(): void {
    const host = this.elementRef.nativeElement;
    const input = host.tagName === 'INPUT' ? host as HTMLInputElement : host.querySelector('input');
    if (!input) return;

    const listen = (type: string, listener: EventListener) => {
      // Capture runs before PrimeNG and Angular read the input.
      input.addEventListener(type, listener, true);
      this.removeListeners.push(() => input.removeEventListener(type, listener, true));
    };

    const insert = (text: string) => {
      for (const char of normalizeNumber(text)) {
        // Preserve PrimeNG's selection, precision, validation and model events.
        this.inputNumber!.onInputKeyPress(new KeyboardEvent('keypress', {
          key: char, charCode: char.charCodeAt(0), keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0), cancelable: true,
        }));
      }
    };

    listen('keypress', event => {
      const keyEvent = event as KeyboardEvent;
      if (!this.inputNumber || input.disabled || input.readOnly || keyEvent.ctrlKey || keyEvent.metaKey || keyEvent.altKey) return;
      if (normalizeNumber(keyEvent.key) === keyEvent.key) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      insert(keyEvent.key);
    });

    listen('beforeinput', event => {
      const inputEvent = event as InputEvent;
      if (!this.inputNumber || input.disabled || input.readOnly || !inputEvent.cancelable ||
          inputEvent.isComposing || inputEvent.inputType !== 'insertText' || !inputEvent.data) return;
      // Mobile keyboards commonly skip keypress entirely.
      event.preventDefault();
      event.stopImmediatePropagation();
      insert(inputEvent.data);
    });

    listen('paste', event => {
      if (!this.inputNumber || input.disabled || input.readOnly) return;
      const text = (event as ClipboardEvent).clipboardData?.getData('text');
      if (!text || normalizeNumber(text) === text) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const clipboardData = new DataTransfer();
      clipboardData.setData('Text', normalizeNumber(text));
      this.inputNumber.onPaste(new ClipboardEvent('paste', { clipboardData, cancelable: true }));
    });

    listen('input', event => {
      if (input.disabled || input.readOnly || (event as InputEvent).isComposing) return;
      const value = normalizeNumber(input.value);
      if (this.inputNumber) {
        // Fallback for non-cancelable beforeinput and IME commits.
        input.value = this.inputNumber.lastValue ?? this.inputNumber.formatValue(this.inputNumber.value);
        this.inputNumber.isSpecialChar = false;
        this.inputNumber.updateValue(event, value, null, null);
        this.inputNumber.lastValue = input.value;
      } else if (input.value !== value) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = value;
        if (start !== null && end !== null) input.setSelectionRange(start, end);
      }
    });
  }

  ngOnDestroy(): void {
    this.removeListeners.forEach(remove => remove());
  }
}
