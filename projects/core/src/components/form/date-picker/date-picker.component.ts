import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import * as moment from 'jalali-moment';
import {Moment} from "jalali-moment";
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {OverlayRef, OverlayService} from "../../overlay/overlay.service";

type ViewMode = 'calendar' | 'month' | 'year';

interface DateValue {
  year: number,
  month: number,
  day: number,
  hour?: number;
  minute?: number;
  second?: number;

  isToday?: boolean;
  isHoliday?: boolean;
  isSelected?: boolean;
  isCurrentMonth?: boolean;
}

@Component({
  selector: 'd-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['../control.scss', './date-picker.component.scss'],
  providers: [createControlValueAccessor(DatePickerComponent)]
})
export class DatePickerComponent extends AbstractFormControl<any> {
  @Input() type: 'gregorian' | 'jalali' = 'gregorian';
  @Input() format = 'YYYY/MM/DD';

  @Output() onLeave = new EventEmitter<any>();
  @Output() onChooseDate = new EventEmitter<string>();

  @ViewChild('pickerTpl') pickerTpl?: TemplateRef<any>
  @ViewChild('yearPickerEl') yearPickerEl?: ElementRef<HTMLDivElement>;

  @HostListener('window:click', ['$event'])
  onWindowClick(e: MouseEvent) {
    this.close();
  }

  get locale() {
    return this.type == 'jalali' ? 'fa' : 'en';
  }

  override onClick(e: MouseEvent) {
    e.stopPropagation();
    this.open();
    super.onClick(e)
  }

  override onFocus(e: FocusEvent) {
    super.onFocus(e);
    this.open();
  }

  view: ViewMode = 'calendar';
  pickerClasses: any = {};

  overlayRef?: OverlayRef;

  todayDate!: Moment;
  selectedDate!: Moment;
  selectedDates: DateValue[] = [];

  todayValue!: DateValue;
  selectedValue!: DateValue;

  weekDays: string[] = [];
  years: number[] = [];
  months: string[] = [];
  dates: DateValue[] = [];

  constructor(
    injector: Injector,
    private overlayService: OverlayService,
  ) {
    super(injector)
  }

  createDate(inp?: string): { value: Moment, isValid: boolean } {
    moment.locale(this.locale, {useGregorianParser: this.type == 'jalali'});
    let result: any = {isValid: true};
    if (inp) {
      try {
        const m = moment.from(inp, this.type, this.format);
        if (m.isValid()) result.value = m;
        else result.isValid = false;
      } catch {
        result.isValid = false;
      }
    } else result.isValid = false;
    if (!result.value) result.value = moment(new Date(), this.type, this.format);
    return result;
  }

  override init() {
    super.init();
    this.todayDate = this.createDate().value;
    this.todayValue = this.getDateTime(this.todayDate);

    let firstDayOfWeek = this.createDate().value.startOf('month');
    while (firstDayOfWeek.get('weekday') > 0) firstDayOfWeek.add(-1, 'day');
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(firstDayOfWeek.format('dd'));
      firstDayOfWeek.add(1, 'day');
    }

    this.months = [];
    const monthMoment = this.createDate().value.startOf('year');
    for (let i = 0; i < 12; i++) {
      this.months.push(monthMoment.format('MMMM'));
      monthMoment.add(1, 'month');
    }

    this.pickerClasses['dir-ltr'] = this.type != 'jalali';
    this.pickerClasses['dir-rtl'] = this.type == 'jalali';
    this.pickerClasses[this.size] = true;

    this.render();
  }

  gotoCurrentDay() {
    this.selectedDate = this.todayDate.clone();

    this.render();
  }

  updateValue(value?: string) {
    const date = this.createDate(value);
    if (date.isValid) {
      value = date.value.format(this.format);
    } else {
      value = undefined;
    }
    if (this._onChange) {
      this._onChange(value);
    }
    this.formControl.setValue(value);
  }

  onInputChange(e: string) {
    this.updateValue(e);

    this.selectedDate = this.createDate(this.formControl.value).value;

    this.render();
  }

  getDateTime(date: Moment): DateValue {
    return {
      day: date.get('date'),
      month: date.get('month'),
      year: date.get('year'),
    }
  }

  override render() {
    if (!this.formControl) return;
    super.render();
    if (!this.selectedDate) this.selectedDate = this.createDate(this.formControl.value).value;

    this.selectedValue = this.getDateTime(this.selectedDate);

    this.createDays();
  }

  createDays() {
    if (!this.overlayRef) return;
    let date = this.selectedDate.clone();
    const curtMonthDayCount = date.daysInMonth();
    const curtMonthWeekDay = date.clone().startOf('month').get('weekday');
    const prevMonthDate = date.clone().add(-1, 'month');
    const prevMonthDayCount = prevMonthDate.daysInMonth();
    const nextMonthDate = date.clone().add(1, 'month');

    this.dates.splice(0, this.dates.length);
    //Prev Month Dates
    const prevMonthYear = prevMonthDate.get('year');
    const prevMonthMonth = prevMonthDate.get('month');
    for (let i = 0; i < curtMonthWeekDay; i++) {
      this.dates.unshift({
        year: prevMonthYear,
        month: prevMonthMonth,
        day: prevMonthDayCount - i,
        isCurrentMonth: false,
      });
    }

    //Current Month Dates
    const curtMonthYear = date.get('year');
    const curtMonthMonth = date.get('month');
    for (let i = 1; i <= curtMonthDayCount; i++) {
      this.dates.push({
        year: curtMonthYear,
        month: curtMonthMonth,
        day: i,
        isCurrentMonth: true,
        isSelected: i == this.selectedValue.day,
        isToday: (i == this.todayValue.day && this.todayValue.month == curtMonthMonth && this.todayValue.year == curtMonthYear),
      });
    }
    //Next Month Dates
    const nextMonthYear = nextMonthDate.get('year');
    const nextMonthMonth = nextMonthDate.get('month');
    for (let i = 1; (this.dates.length % 7) != 0; i++) {
      this.dates.push({
        year: nextMonthYear,
        month: nextMonthMonth,
        day: i,
        isCurrentMonth: false,
      });
    }
    this.dates.forEach((x, i) => x.isHoliday = (i % 7 == 6))
  }

  selectDate(date: DateValue) {
    if (this.type == 'jalali') {
      this.selectedDate = this.createDate().value;
      this.selectedDate.jDate(date.day);
      this.selectedDate.jMonth(date.month);
      this.selectedDate.jYear(date.year);
    } else {
      this.selectedDate.date(date.day);
      this.selectedDate.month(date.month);
      this.selectedDate.year(date.year);
    }
    this.updateValue(this.selectedDate.format(this.format));
    this.render();
    this.close();
  }

  selectMonth(month: number) {
    this.view = 'calendar';
    if (this.type == 'jalali') this.selectedDate.jMonth(month);
    else this.selectedDate.month(month);
    this.render();
  }

  selectYear(year: number) {
    this.view = 'month';
    if (this.type == 'jalali') this.selectedDate.jYear(year);
    else this.selectedDate.year(year);
    this.render();
  }

  clear() {
    this.updateValue('');
  }

  showMonths() {
    this.view = 'month';
  }

  showYears() {
    this.view = 'year';

    let year = this.selectedDate.get('year');
    this.years = [year];
    for (let i = 1; i < 100; i++) {
      this.years.unshift(year - i)
      this.years.push(year + i)
    }
    const yearsEl = this.yearPickerEl?.nativeElement;
    if (yearsEl) {
      setTimeout(() => {
        yearsEl.scrollTop = (yearsEl.scrollHeight / 2) - (yearsEl.offsetHeight / 2);
      }, 100);
    }
  }

  open() {
    if (this.pickerTpl && !this.overlayRef) {
      this.onInputChange(this.formControl.value);
      this.overlayRef = this.overlayService.create({
        template: this.pickerTpl,
        targetElement: this.elementRef.nativeElement
      });
      this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
    }
    this.render();
  }

  close() {
    this.overlayRef?.destroy();
  }
}
