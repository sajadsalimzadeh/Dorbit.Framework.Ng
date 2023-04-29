import {Component, HostListener, Input} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";

@Component({
  selector: 'd-radio',
  templateUrl: 'radio.component.html',
  styleUrls: ['../control.scss', './radio.component.scss'],
  providers: [createControlValueAccessor(RadioComponent)]
})
export class RadioComponent extends AbstractFormControl<any> {

  @Input() value: any;

  @HostListener('keydown.space')
  onKeyDownSpace() {
    this.toggle();
  }

  override onClick(e: MouseEvent) {
    this.toggle();
    super.onClick(e);
  }

  override render() {
    super.render();
    this.classes['checked'] = this.formControl.value == this.value;
  }

  toggle() {
    this.formControl.setValue(this.value);
  }
}
