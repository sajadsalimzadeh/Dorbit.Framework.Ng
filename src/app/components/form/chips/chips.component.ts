import {
  Component, Input,
} from "@angular/core";
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {Chips} from "./models";

@Component({
  selector: 'dev-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss', '../control-box.scss'],
  providers: [createControlValueAccessor(ChipsComponent)]
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
