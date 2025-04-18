import {Component, Input,} from "@angular/core";
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

export type Chips = any;

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    selector: 'd-chips',
    templateUrl: './chips.component.html',
    styleUrls: ['../control.scss', './chips.component.scss'],
    providers: [createControlValueAccessor(ChipsComponent)],
})
export class ChipsComponent extends AbstractFormControl<Chips> {
  @Input() value: string = '';
  @Input() separator: string = ',';
  @Input() maxHeight = '150px';

  override onClick(e: MouseEvent) {
    e.stopPropagation();
    super.onClick(e);
  }


  override init() {
    super.init();

    if (!this.formControl.value || !Array.isArray(this.formControl.value)) {
      this.formControl.setValue([]);
    }
  }

  onInputKeyDown(e: KeyboardEvent) {
    if (e.key == this.separator || e.key === 'Enter') {
      this.processValue();
      e.preventDefault();
    } else if (e.key === 'Backspace' && !this.value) {
      if (this.formControl.value.length > 0) {
        this.remove(this.formControl.value.length - 1)
      }
    }
  }

  onValueChange() {
    if (this.value.split(',').length > 1) {
      this.processValue();
    }
  }

  processValue() {
    const chips = this.formControl.value as Chips[];
    this.value.split(',').filter(x => !!x).forEach(x => chips.push(x));
    setTimeout(() => this.value = '', 1);
  }

  remove(index: number) {
    const chips = this.formControl.value as Chips[];
    if (chips.length > index) {
      chips.splice(index, 1);
    }
  }
}
