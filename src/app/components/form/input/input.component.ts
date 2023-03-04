import {
  Component,
  ContentChildren, Injector,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {DevTemplateDirective} from "../../../directives/template/dev-template.directive";
import {FormControlService} from "../form-control.service";

export interface MaskItem {
  replacement: string;
  pattern?: RegExp;
}

@Component({
  selector: 'dev-input',
  templateUrl: 'input.component.html',
  styleUrls: ['./input.component.scss', '../control-box.scss'],
  providers: [createControlValueAccessor(InputComponent)]
})
export class InputComponent extends AbstractFormControl<string | number> implements OnInit, OnChanges, OnDestroy {
  @Input() type: 'text' | 'textarea' | 'number' = 'text';
  @Input() mask?: string | MaskItem[];
  @Input() pattern?: string;

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
  }

  maskValue?: string;

  constructor(injector: Injector) {
    super(injector);
  }

  override render() {
    super.render();

    if (this.mask) {
      const masks = this.getMaskItems();
      let str = '';
      const value = (this.formControl.value ?? '') as string;
      for (let i = 0; i < masks.length; i++) {
        const mask = masks[i];
        const cv = (value.length > i ? value[i] : '');
        if(cv && mask.pattern && mask.pattern.test(cv)) {
          str += cv;
        } else {
          str += mask.replacement;
        }
      }
      this.formControl.setValue(str);
    }
  }

  private getMaskItems(): MaskItem[] {
    if (typeof this.mask === 'string') {
      const items: MaskItem[] = [];
      let ignoreChar = false;
      for (let i = 0; i < this.mask.length; i++) {
        const ch = this.mask[i];
        if (ignoreChar) {
          items.push({replacement: ch});
          ignoreChar = false;
          continue;
        }
        if (ch == '9') {
          items.push({replacement: '_', pattern: /[0-9]/});
        } else if (ch == 'a') {
          items.push({replacement: '_', pattern: /[a-zA-Z]/});
        } else if (ch == '*') {
          items.push({replacement: '_', pattern: /[0-9a-zA-Z]/});
        } else if (ch == '/') {
          ignoreChar = true;
        } else {
          items.push({replacement: ch});
        }
      }
      return items;
    } else if (this.mask) return this.mask;
    return [];
  }
}
