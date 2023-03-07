import {
  Component,
  ContentChildren, ElementRef, Injector,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  QueryList, ViewChild,
} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {DevTemplateDirective} from "../../../directives/template/dev-template.directive";
import {FormControlService} from "../form-control.service";

export interface MaskItem {
  placeholder: string;
  pattern?: RegExp;
}

@Component({
  selector: 'dev-input',
  templateUrl: 'input.component.html',
  styleUrls: ['./input.component.scss', '../control-box.scss'],
  providers: [createControlValueAccessor(InputComponent)]
})
export class InputComponent extends AbstractFormControl<string> implements OnInit, OnChanges, OnDestroy {
  @Input() type: 'text' | 'textarea' | 'number' = 'text';
  @Input() mask?: string | MaskItem[];
  @Input() pattern?: string;

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
  }

  maskValue: string = '';

  constructor(injector: Injector) {
    super(injector);
  }

  override render() {
    super.render();
    if(this.mask) {
      this.loadMaskedValue();
    }
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
    this.formControl.setValue(newValue);
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
        if(ch == 'y' && this.mask.indexOf('yyyy') == i) {
          items.push({placeholder: placeholder, pattern: /[1-2]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          i += 3;
        } else if(ch == 'y' && this.mask.indexOf('yy') == i) {
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          i += 1;
        } else if(ch == 'm' && this.mask.indexOf('mm') == i) {
          items.push({placeholder: placeholder, pattern: /[0-1]/});
          items.push({placeholder: placeholder, pattern: /[0-9]/});
          i += 1;
        } else if(ch == 'd' && this.mask.indexOf('dd') == i) {
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

  onKeyDown(e: KeyboardEvent) {
    if (this.mask) this.maskOnKeyDow(e)
  }

  maskOnKeyDow(e: KeyboardEvent) {
    if (e.key.length == 1) {
      this.maskValue += e.key;
    } else {
      if (e.key == 'Backspace') {
        this.maskValue = this.maskValue.substring(0, this.maskValue.length - 1);
      }
    }
  }
}
