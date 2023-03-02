import {Component, HostBinding, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../abstract-form-control.directive";

@Component({
  selector: 'dev-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [createControlValueAccessor(CheckboxComponent)]
})
export class CheckboxComponent extends AbstractFormControl<boolean | null> implements OnInit, OnChanges {
  @Input() mode: 'binary' | 'ternary' = 'binary';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() status: 'primary' | 'warning' | 'success' | 'danger' | 'link' = 'primary';

  @HostListener('click', ['$event'])
  onClick() {
    this.toggle();
  }

  @HostBinding('class')
  classes: any = {};

  override ngOnInit() {
    super.ngOnInit();
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.render();
  }

  render() {
    if(this.mode == 'binary' && !this.innerValue) {
      this.innerValue = false;
    }

    this.classes = {};
    this.classes[this.size] = true;
    this.classes[this.status] = true;
    this.classes['fill'] = (this.innerValue || this.innerValue === null || this.innerValue === undefined);
  }

  toggle() {
    if (this.mode == 'ternary' && this.innerValue === null || this.innerValue === undefined) {
      this.innerValue = false;
    } else if(this.innerValue) {
      this.innerValue = (this.mode == 'ternary' ? null : false);
    } else this.innerValue = true;
    this.writeValue(this.innerValue);
  }
}
