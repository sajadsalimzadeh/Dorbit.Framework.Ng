import {
  Component, ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener, Injector,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges, TemplateRef, ViewChild
} from "@angular/core";
import * as moment from 'jalali-moment';
import {Moment, MomentInput} from "jalali-moment";
import {AbstractFormControl, createControlValueAccessor} from "../abstract-form-control.directive";
import {OverlayService} from "../../overlay/overlay.service";
import {OverlayComponent} from "../../overlay/overlay.component";

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
  selector: 'dev-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss', '../control-box.scss'],
  providers: [createControlValueAccessor(DatePickerComponent)]
})
export class DatePickerComponent extends AbstractFormControl<any> implements OnInit, OnChanges {
  @Input() locale: 'en' | 'fa' = 'en';
  @Input() format = 'YYYY/MM/DD';

  @Output() onLeave = new EventEmitter<any>();
  @Output() onChooseDate = new EventEmitter<string>();

  @ViewChild('pickerTpl') pickerTpl?: TemplateRef<any>
  @ViewChild('yearPickerEl') yearPickerEl?: ElementRef<HTMLDivElement>;

  @HostListener('window.click', ['$event'])
  onWindowClick(e: MouseEvent) {
    let el: ParentNode | null = e.target as ParentNode;
    let isClickOnThisComponent = false;
    while (el) {
      if (el == this.elementRef.nativeElement) {
        isClickOnThisComponent = true;
        break;
      }
      el = el.parentNode
    }
    if (!isClickOnThisComponent) {
      this.onLeave.emit();
    }
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    e.stopPropagation();
    if (this.pickerTpl && !this.componentRef) {
      this.componentRef = this.overlayService.createByTemplate(this.elementRef.nativeElement, this.pickerTpl);
      this.componentRef.onDestroy(() => this.componentRef = undefined);
    }
    this.render();
  }

  view: ViewMode = 'calendar';
  pickerClasses: any = {};

  componentRef?: ComponentRef<OverlayComponent>;

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
    private elementRef: ElementRef,
    private overlayService: OverlayService,
  ) {
    super(injector)
  }

  ngOnChanges(changes: SimpleChanges): void {
    try {
      this.init();
    } catch {
    }
  }

  createDate(inp?: string): { value: Moment, isValid: boolean } {
    moment.locale(this.locale, {useGregorianParser: this.locale == 'fa'});
    let result: any = {isValid: true};
    if (inp) {
      try {
        const m = moment.from(inp, this.locale, this.format);
        if (m.isValid()) result.value = m;
        else result.isValid = false;
      } catch {
        result.isValid = false;
      }
    } else result.isValid = false;
    if (!result.value) result.value = moment(new Date(), this.locale, this.format);
    return result;
  }

  init() {
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

    this.pickerClasses['dir-ltr'] = this.locale != 'fa';
    this.pickerClasses['dir-rtl'] = this.locale == 'fa';

    this.render();
  }

  gotoCurrentDay() {
    this.selectedDate = this.todayDate.clone();

    this.render();
  }

  updateValue(value?: string) {
    if (value) this.innerValue = value;
    const date = this.createDate(this.innerValue);
    if (date.isValid) {
      this._onChange(date.value.format(this.format));
    } else {
      this._onChange(undefined);
    }
  }

  onInputChange() {
    this.updateValue();

    this.selectedDate = this.createDate(this.innerValue).value;

    this.render();
  }

  getDateTime(date: Moment): DateValue {
    return {
      day: date.get('date'),
      month: date.get('month'),
      year: date.get('year'),
    }
  }

  render() {
    if(!this.selectedDate) this.selectedDate = this.createDate(this.innerValue).value;

    this.selectedValue = this.getDateTime(this.selectedDate);

    this.createDays();
  }

  createDays() {
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
    if (this.locale == 'fa') {
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
    if (this.locale == 'fa') this.selectedDate.jMonth(month);
    else this.selectedDate.month(month);
    this.render();
  }

  selectYear(year: number) {
    this.view = 'month';
    if (this.locale == 'fa') this.selectedDate.jYear(year);
    else this.selectedDate.year(year);
    this.render();
  }

  clear() {
    this.innerValue = '';
    this.updateValue();
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

  close() {
    this.componentRef?.destroy();
  }
}
