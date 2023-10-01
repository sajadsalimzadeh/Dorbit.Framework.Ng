import {Component, Input, SimpleChanges} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";

@Component({
  selector: 'd-input-split',
  templateUrl: './input-split.component.html',
  styleUrls: ['./input-split.component.scss'],
  providers: [createControlValueAccessor(InputSplitComponent)]
})
export class InputSplitComponent extends AbstractFormControl<string> {
  @Input({required: true}) length!: number;

  override set autofocus(value: any) {
    setTimeout(() => {
      this.elementRef?.nativeElement.querySelector('input')?.focus();
    }, 10)
  }

  values: { text: string }[] = [];

  override ngOnInit() {
    super.ngOnInit();

    this.formControl.valueChanges.subscribe((e: string) => {
      for (let i = 0; i < this.values.length; i++) {
        this.values[i].text = (e.length > i ? e[i] : '');
      }
    })
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if ('length' in changes) {
      this.values = [];
      for (let i = 0; i < this.length; i++) {
        this.values.push({text: ''});
      }
    }
  }

  onValueChanged() {
    const value = this.values.map(x => x.text).join('').substring(0, this.length).trim();
    for (let i = 0; i < this.values.length; i++) {
      this.values[i].text = (value.length > i ? value[i] : '');
    }
    this.focusByIndex(this.values.findIndex(x => !x.text));
    this.formControl.setValue(value);
  }

  onKeyUp(index: number, e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      if (!this.values[index].text) {
        this.focusByIndex(this.values.findIndex(x => !x.text) - 1);
      }
    }
  }

  focusByIndex(index: number) {
    const elements = this.elementRef?.nativeElement?.querySelectorAll('input');
    if (index > -1 && index < elements.length) {
      elements[index]?.focus();
    }
  }
}
