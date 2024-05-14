import {Component, HostListener, Injector, Input,} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {KeyFilters} from "../../key-filter/key-filter.directive";

export interface MaskItem {
  placeholder: string;
  pattern?: RegExp;
}

const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function fixPersianNumbers(str: string) {
  for (let i = 0; i < 10; i++) {
    str = str.replaceAll(persianNumbers[i], i.toString());
  }
  return str;
}

function fixArabicNumbers(str: string) {
  for (let i = 0; i < 10; i++) {
    str = str.replaceAll(arabicNumbers[i], i.toString());
  }
  return str;
}

@Component({
  selector: 'd-input',
  templateUrl: 'input.component.html',
  styleUrls: ['../control.scss', './input.component.scss'],
  providers: [createControlValueAccessor(InputComponent)]
})
export class InputComponent extends AbstractFormControl<string> {

  @Input() type: 'text' | 'password' | 'email' | 'textarea' | 'number' = 'text';
  @Input() mode: '' | 'fill' = '';
  @Input() inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search';
  @Input() align: '' | 'left' | 'right' | 'center' | 'justify' = '';
  @Input() mask?: string | MaskItem[];
  @Input() pattern?: string;
  @Input() min?: number;
  @Input() max?: number;
  @Input() minLength: number = 0;
  @Input() digit: number = 5;
  @Input() maxLength: number = 100000000;
  @Input() rows: number | string | null = null;
  @Input() cols: number | string | null = null;
  @Input() keyFilter?: KeyFilters;
  @Input() icon?: string;
  @Input() iconPos: 'start' | 'end' = 'start';

  @HostListener('dblclick')
  onDoubleClick() {
    if (this.type != 'textarea') {
      this.inputEl?.nativeElement.select();
    }
  }

  maskValue: string = '';
  override focusable = false;

  constructor(injector: Injector) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.type == "number") {
      this.inputMode = 'decimal';
      if (!this.dir) this.dir = 'ltr';
    }

    this.subscription.add(this.formControl.valueChanges.subscribe(e => this.updateDisplayValue()));
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this.updateDisplayValue();
  }

  protected updateValue() {
    if (!this.inputEl) return;
    const el = this.inputEl.nativeElement;
    let value = el.value ?? '';

    console.log(value)
    value = fixPersianNumbers(value);
    value = fixArabicNumbers(value);

    if (this.type === 'number') {
      if (!value) {
        this.formControl.setValue(null);
        return;
      }

      // Android and Iphone number keyboard not have minus symbol
      if (value.startsWith('٫')) el.value = value = value.replace('٫', '-');
      else if (value.startsWith(',')) el.value = value = value.replace(',', '-');
      else if (value.startsWith('.')) el.value = value = value.replace('.', '-');

      // string to number format
      value = value.replaceAll(',', '') ?? '';
      value = value.replaceAll('٫', '') ?? '';
      value = value.replaceAll('٬', '') ?? '';
      console.log(value)

      // zero digit precision prevent point symbol
      if (value.endsWith('.')) {
        if (this.digit > 0) return;
        else el.value = value = value.replace('.', '');
      }


      let numValue = +value;
      if (isNaN(numValue)) return;

      const splitValue = value.split('.');
      if(splitValue.length > 1 && splitValue[1]) {
        numValue = +(splitValue[0] + '.' + splitValue[1].substring(0, this.digit));
      }

      if(this.min !== undefined) numValue = Math.max(numValue, this.min);
      if(this.max !== undefined) numValue = Math.min(numValue, this.max);

      this.formControl.setValue(numValue);
      //
      // if (this.digit == 0) {
      //   this.formControl.setValue(Math.floor(numValue));
      // } else if (/\.$/.test(value)) {
      //   this.formControl.setValue(numValue);
      // } else if (/\.\d/.test(value)) {
      //   const match = value.match(`-*\\d+\\.\\d{0,${this.digit}}`);
      //   if (match) this.formControl.setValue(+match[0]);
      // } else {
      //
      //
      //   this.formControl.setValue(numValue);
      // }
    } else {
      this.formControl.setValue(value);
    }
    this.onKeyup.emit();
  }

  updateDisplayValue() {
    const el = this.inputEl?.nativeElement;
    if (!el) return;
    if (this.type === 'number') {
      if (typeof this.formControl.value === 'number') {
        el.value = this.formControl.value.toLocaleString('en-US');
      } else {
        if (!this.formControl.value || Number.isNaN(+this.formControl.value)) {
          el.value = '';
        } else {
          el.value = (+this.formControl.value).toLocaleString('en-US');
        }
      }
    } else {
      el.value = this.formControl.value ?? '';
    }
  }

  override render() {
    super.render();

    if (this.inputEl) {
      if (this.inputMode) {
        this.inputEl.nativeElement.inputMode = this.inputMode;
      }
    }

    if (this.mask) {
      this.loadMaskedValue();
    }
  }

  override init() {
    super.init();

    this.onKeydown.subscribe(e => {
      if (this.mask) this.maskOnKeyDown(e)
    });

    this.onKeyup.subscribe(e => {
      this.render();
    })
  }

  private loadMaskedValue() {
    const masks = this.getMaskItems();
    let newValue = '';
    let tempMaskedValue = '';
    if (this.maskValue || this.focused) {
      for (let i = 0, j = 0; i < masks.length; i++) {
        const mask = masks[i];
        let tempChar = mask.placeholder;
        if (mask.pattern) {
          const ch = (this.maskValue.length > j ? this.maskValue[j] : '');
          if (ch && mask.pattern.test(ch)) {
            tempChar = ch;
            tempMaskedValue += ch;
          }
          j++;
        }
        newValue += tempChar;
      }
      this.maskValue = tempMaskedValue;
    }
    this.formControl?.setValue(newValue);
    const element = this.inputEl?.nativeElement;
    if (element) element.value = newValue;
  }

  private getMaskItems(): MaskItem[] {
    if (typeof this.mask === 'string') {
      const items: MaskItem[] = [];
      let ignoreChar = false;
      for (let i = 0; i < this.mask.length; i++) {
        const placeholder = (this.placeholder?.length == this.mask.length ? this.placeholder[i] : '_')
        const ch = this.mask[i];
        if (ignoreChar) {
          items.push({placeholder: ch});
          ignoreChar = false;
          continue;
        }
        if (ch == 'y' && this.mask.indexOf('yyyy') == i) {
          items.push({placeholder: placeholder, pattern: /[1-2]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          i += 3;
        } else if (ch == 'y' && this.mask.indexOf('yy') == i) {
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          i += 1;
        } else if (ch == 'm' && this.mask.indexOf('mm') == i) {
          items.push({placeholder: placeholder, pattern: /[0-1]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          i += 1;
        } else if (ch == 'd' && this.mask.indexOf('dd') == i) {
          items.push({placeholder: placeholder, pattern: /[0-3]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          i += 1;
        } else if (ch == '9') {
          items.push({placeholder: placeholder, pattern: /[0-9]/});
        } else if (ch == 'a') {
          items.push({placeholder: placeholder, pattern: /[a-zA-Z]/});
        } else if (ch == '*') {
          items.push({placeholder: placeholder, pattern: /[0-9a-zA-Z]/});
        } else if (ch == '/') {
          ignoreChar = true;
        } else {
          items.push({placeholder: ch});
        }
      }
      return items;
    } else if (this.mask) return this.mask;
    return [];
  }

  maskOnKeyDown(e: KeyboardEvent) {
    if (e.key?.length == 1) {
      this.maskValue += e.key;
    } else {
      if (e.key == 'Backspace') {
        this.maskValue = this.maskValue.substring(0, this.maskValue.length - 1);
      }
    }
  }
}
