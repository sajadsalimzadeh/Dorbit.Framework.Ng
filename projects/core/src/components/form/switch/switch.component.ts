import {Component, HostListener} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";

@Component({
  selector: 'd-switch',
  templateUrl: 'switch.component.html',
  styleUrls: ['../control.scss', './switch.component.scss'],
  providers: [createControlValueAccessor(SwitchComponent)]
})
export class SwitchComponent extends AbstractFormControl<boolean | null> {

  @HostListener('keydown.space')
  onKeyDownSpace() {this.toggle();}

  override onClick(e: MouseEvent) {
    this.toggle();
    super.onClick(e);
  }

  override render() {
    super.render();
    this.classes['checked'] = !!this.formControl.value;
  }

  toggle() {
    this.writeValue(!this.formControl.value);
  }
}
