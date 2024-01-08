import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AbstractFormControl} from "../form-control.directive";
// @ts-ignore
import moment from 'jalali-moment';

interface Option {
  value: number;
  text: string;
}

@Component({
  selector: 'd-date-picker-inline',
  templateUrl: './date-picker-inline.component.html',
  styleUrls: ['./date-picker-inline.component.scss']
})
export class DatePickerInlineComponent extends AbstractFormControl<string> {
  @Input() previousYearCount: number = 100;
  @Input() nextYearCount: number = 100;
  @Input() format: string = 'yyyy/MM/DD';
  @Input() locale: 'fa' | 'en' = 'en';

  form = new FormGroup({
    day: new FormControl<number | null>(null, [Validators.min(1), Validators.max(31)]),
    month: new FormControl<number | null>(null, [Validators.min(1), Validators.max(12)]),
    year: new FormControl<number | null>(null, [Validators.min(1100), Validators.max(2300)]),
  });

  days: Option[] = [];
  months: Option[] = [];
  years: Option[] = [];

  override ngOnInit() {
    super.ngOnInit();

    this.form.valueChanges.subscribe(() => this.updateValue());

    this.subscription.add(this.onChange.subscribe(e => {
      moment.locale(this.locale);
      const m = moment(e)

      this.form.patchValue({
        day: m.date(),
        month: m.month() + 1,
        year: m.year(),
      })
    }))
  }

  private updateValue() {
    if (this.form.invalid) return;
    const value = this.form.value;
    const year = (value.year && !isNaN(+value.year) ? +value.year : 0);
    const month = (value.month && !isNaN(+value.month) ? +value.month : 0);
    const day = (value.day && !isNaN(+value.day) ? +value.day : 0);
    if (!year || !month || !day) return;
    this.formControl.setValue(moment({year, month: month - 1, date: day}).format(this.format));
  }

  override render() {
    super.render();

    const value = this.form.value;
    moment.locale(this.locale);
    const m = moment();
    const currentYear = (value.year ? value.year : m.get('year'));

    this.days = this.createOptions(1, 31);
    this.months = this.createOptions(1, 12);
    this.years = this.createOptions(currentYear - this.previousYearCount, currentYear + this.nextYearCount);
  }

  createOptions(from: number, to: number) {
    const array: Option[] = [];
    while (from <= to) {
      array.push({
        text: from + '',
        value: from,
      });
      from++;
    }
    return array;
  }
}
