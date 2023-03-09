import {Component, HostListener, Input} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";

@Component({
  selector: 'dev-switch',
  templateUrl: 'switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [createControlValueAccessor(SwitchComponent)]
})
export class SwitchComponent extends AbstractFormControl<boolean | null> {
  @Input() status: 'primary' | 'warning' | 'success' | 'danger' | 'link' = 'primary';

  @HostListener('keydown.space')
  onKeyDownSpace() {this.toggle();}

  override onClick(e: MouseEvent) {
    this.toggle();
    super.onClick(e);
  }

  override render() {
    super.render();
    this.classes[this.status] = true;
    this.classes['checked'] = !!this.formControl.value;
  }

  toggle() {
    this.writeValue(!this.formControl.value);
  }
}
