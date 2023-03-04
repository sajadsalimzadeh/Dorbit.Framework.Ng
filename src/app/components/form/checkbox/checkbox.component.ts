import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";

@Component({
  selector: 'dev-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [createControlValueAccessor(CheckboxComponent)]
})
export class CheckboxComponent extends AbstractFormControl<boolean | null> implements OnInit {
  @Input() mode: 'binary' | 'ternary' = 'binary';
  @Input() status: 'primary' | 'warning' | 'success' | 'danger' | 'link' = 'primary';

  @HostListener('click', ['$event'])
  onClick() {
    this.toggle();
  }

  override render() {
    super.render();
    if(this.mode == 'binary' && !this.formControl.value) {
      this.formControl.setValue(false);
    }
    this.classes[this.status] = true;
    this.classes['fill'] = (this.formControl.value || this.formControl.value === null || this.formControl.value === undefined);
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
