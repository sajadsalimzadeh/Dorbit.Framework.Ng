import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { NumberSanitizerDirective } from './number-sanitizer.directive';

@Component({
  standalone: true,
  imports: [InputNumberModule, NumberSanitizerDirective, ReactiveFormsModule, FormsModule],
  template: `<p-input-number [formControl]="amount" [min]="min" [max]="max" [maxFractionDigits]="3" (onInput)="emitted = $event.value" />
    <p-input-number [(ngModel)]="price" [maxFractionDigits]="0" />
    <input numberSanitizer [formControl]="text" />`,
})
class TestHost {
  amount = new FormControl<number | null>(null);
  min: number | undefined;
  max: number | undefined;
  price: number | null = null;
  text = new FormControl('');
  emitted: number | string | null | undefined;
}

describe('NumberSanitizerDirective with PrimeNG', () => {
  let fixture: ComponentFixture<TestHost>;
  let input: HTMLInputElement;
  let component: InputNumber;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.query(By.directive(InputNumber));
    component = element.componentInstance;
    input = element.nativeElement.querySelector('input');
  });

  function type(text: string): void {
    input.dispatchEvent(new InputEvent('beforeinput', {
      data: text, inputType: 'insertText', bubbles: true, cancelable: true,
    }));
  }

  it('uses a stable default locale and updates the form for the first mobile digit', () => {
    expect(component.locale).toBe('en-US');
    type('۱');
    expect(input.value).toBe('1');
    expect(fixture.componentInstance.amount.value).toBe(1);
    expect(fixture.componentInstance.emitted).toBe(1);
  });

  it('accepts Persian, Arabic and English digits and the Persian decimal separator', () => {
    type('۱۲٣٫۴5');
    expect(fixture.componentInstance.amount.value).toBe(123.45);
    expect(input.value).toBe('123.45');
  });

  it('replaces selected text and applies the configured fraction precision', () => {
    type('123');
    input.setSelectionRange(1, 2);
    type('۹');
    expect(fixture.componentInstance.amount.value).toBe(193);
    input.setSelectionRange(input.value.length, input.value.length);
    type('٫۱۲۳۴');
    expect(fixture.componentInstance.amount.value).toBe(193.123);
  });

  it('normalizes pasted Persian numbers through PrimeNG', () => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('Text', '۱٬۲۳۴٫۵');
    input.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
    expect(fixture.componentInstance.amount.value).toBe(1234.5);
  });

  it('updates the model for mobile input without cancelable beforeinput', () => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Unidentified', bubbles: true }));
    input.value = '۱';
    input.dispatchEvent(new InputEvent('input', { data: '۱', bubbles: true }));
    expect(fixture.componentInstance.amount.value).toBe(1);
    expect(input.value).toBe('1');
  });

  it('updates ngModel immediately for mobile input', async () => {
    const modelInput = fixture.debugElement.queryAll(By.directive(InputNumber))[1].nativeElement.querySelector('input');
    modelInput.dispatchEvent(new InputEvent('beforeinput', {
      data: '١', inputType: 'insertText', bubbles: true, cancelable: true,
    }));
    await fixture.whenStable();
    expect(fixture.componentInstance.price).toBe(1);
  });

  it('accepts Persian digits from desktop keypress without inserting twice', () => {
    const event = new KeyboardEvent('keypress', {
      key: '۱', keyCode: 0x06F1, which: 0x06F1, bubbles: true, cancelable: true,
    });
    input.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(fixture.componentInstance.amount.value).toBe(1);
    expect(input.value).toBe('1');
  });

  it('handles IME commit after leaving composing input alone', () => {
    input.value = '۱';
    input.dispatchEvent(new InputEvent('input', { isComposing: true, bubbles: true }));
    expect(fixture.componentInstance.amount.value).toBeNull();
    input.dispatchEvent(new InputEvent('input', { inputType: 'insertCompositionText', bubbles: true }));
    expect(fixture.componentInstance.amount.value).toBe(1);
  });

  it('keeps desktop Backspace working and clears the model for native mobile deletion', () => {
    type('۱۲');
    input.setSelectionRange(2, 2);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
    expect(fixture.componentInstance.amount.value).toBe(1);
    input.value = '';
    input.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward', bubbles: true }));
    expect(fixture.componentInstance.amount.value).toBeNull();
    expect(input.value).toBe('');
  });

  it('preserves PrimeNG min/max validation on blur', () => {
    fixture.componentInstance.min = 0;
    fixture.componentInstance.max = 10;
    fixture.detectChanges();
    type('۱۲');
    input.dispatchEvent(new FocusEvent('blur'));
    expect(fixture.componentInstance.amount.value).toBe(10);
  });

  it('normalizes ordinary input before Angular reads it', () => {
    const textInput = fixture.nativeElement.querySelector('input[numberSanitizer]') as HTMLInputElement;
    textInput.value = '۱۲٣';
    textInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    expect(fixture.componentInstance.text.value).toBe('123');
  });

  it('leaves readonly inputs unchanged', () => {
    input.readOnly = true;
    type('۱');
    expect(fixture.componentInstance.amount.value).toBeNull();
  });

  it('removes native listeners when the component is destroyed', () => {
    fixture.destroy();
    const event = new InputEvent('beforeinput', {
      data: '۱', inputType: 'insertText', bubbles: true, cancelable: true,
    });
    input.dispatchEvent(event);
    expect(event.defaultPrevented).toBeFalse();
  });
});
