import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";

@Component({
  selector: 'd-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['./checkbox.component.scss', '../control.scss'],
  providers: [createControlValueAccessor(CheckboxComponent)]
})
export class CheckboxComponent extends AbstractFormControl<boolean | null> {
  @Input() mode: 'binary' | 'ternary' = 'binary';

  @HostListener('keydown.space')
  onKeyDownSpace() {
    this.toggle();
  }

  override onClick(e: MouseEvent) {
    this.toggle();
    super.onClick(e);
  }

  override writeValue(value: boolean | null) {
    super.writeValue(value);
    if(this.mode == 'binary' && !value && value !== false) {
      this.formControl.setValue(false);
    }
  }

  override render() {
    super.render();
    const value = this.formControl.value;
    this.classes['fill'] = (value === true || value === null || value === undefined);
  }

  toggle() {
    let value = this.formControl.value;
    if (this.mode == 'ternary' && value === null || value === undefined) {
      value = false;
    } else if(value) {
      value = (this.mode == 'ternary' ? null : false);
    } else value = true;
    this.writeValue(value);
  }
}
