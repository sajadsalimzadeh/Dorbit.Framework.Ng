import {
  Component,
  ElementRef,
  EventEmitter, HostBinding,
  HostListener,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import * as moment from 'jalali-moment';
import {locale, Moment, MomentObjectOutput} from "jalali-moment";

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
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class DatePickerComponent implements OnInit, OnChanges {
  @Input() locale: 'en' | 'fa' = 'en';
  @Input() value?: string;

  @Output() onLeave = new EventEmitter<any>();
  @Output() onChooseDate = new EventEmitter<DateValue>();

  @HostBinding('class') classes: any = {};

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

  showDate!: Moment;
  todayDate!: Moment;
  selectedDate!: Moment;
  selectedDates: DateValue[] = [];

  showValue!: MomentObjectOutput;
  todayValue!: MomentObjectOutput;
  selectedValue!: MomentObjectOutput;

  view: ViewMode = 'calendar'

  weekDays: string[] = [];
  years: number[] = [];
  months: string[] = [];
  dates: DateValue[] = [];

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  init() {
    moment.locale(this.locale);
    this.todayDate = moment();
    this.selectedDate = moment(this.value);
    this.showDate = this.selectedDate.clone();
    this.render();

    let firstDayOfWeek = moment().startOf('month');
    while (firstDayOfWeek.get('weekday') > 0) firstDayOfWeek.add(-1, 'day');
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(firstDayOfWeek.format('dd'));
      firstDayOfWeek.add(1, 'day');
    }

    this.months = [];
    const monthMoment = moment().startOf('year');
    for (let i = 0; i < 12; i++) {
      this.months.push(monthMoment.format('MMMM'));
      monthMoment.add(1, 'month');
    }

    this.classes['dir-ltr'] = this.locale != 'fa';
    this.classes['dir-rtl'] = this.locale == 'fa';
  }

  gotoCurrentDay() {
    this.render();
  }

  getDateTime(date: Moment): MomentObjectOutput {
    return {
      date: date.get('date'),
      months: date.get('months'),
      years: date.get('years'),
      hours: date.get('hours'),
      minutes: date.get('minutes'),
      seconds: date.get('seconds'),
      milliseconds: date.get('milliseconds'),
    }
  }

  render() {
    this.showValue = this.getDateTime(this.showDate);
    this.todayValue = this.getDateTime(this.todayDate);
    this.selectedValue = this.getDateTime(this.selectedDate);

    this.createDays();
  }

  createDays() {
    let date = this.showDate.clone();
    const curtMonthDayCount = date.daysInMonth();
    const curtMonthWeekDay = date.clone().startOf('month').get('weekday');
    const prevMonthDate = date.clone().add(-1, 'month');
    const prevMonthDayCount = prevMonthDate.daysInMonth();
    const nextMonthDate = date.clone().add(1, 'month');

    const dates: DateValue[] = [];
    //Prev Month Dates
    const prevMonthYear = prevMonthDate.get('year');
    const prevMonthMonth = prevMonthDate.get('month');
    for (let i = 0; i < curtMonthWeekDay; i++) {
      dates.unshift({
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
      dates.push({
        year: curtMonthYear,
        month: curtMonthMonth,
        day: i,
        isCurrentMonth: true,
        isSelected: i == this.selectedValue.date,
        isToday: i == this.todayValue.date,
      });
    }
    //Next Month Dates
    const nextMonthYear = nextMonthDate.get('year');
    const nextMonthMonth = nextMonthDate.get('month');
    for (let i = 1; (dates.length % 7) != 0; i++) {
      dates.push({year: nextMonthYear, month: nextMonthMonth, day: i});
    }
    dates.forEach((x,i) => x.isHoliday = (i % 7 == 6))
    this.dates = dates;
  }

  selectDate(date: DateValue) {
    this.onChooseDate.emit(date);
    this.selectedDate.set(date)
    this.render();
  }

  selectMonth(month: number) {
    this.view = 'calendar';
    this.showDate.set({month});
    this.render();
  }

  selectYear(year: number) {
    this.view = 'calendar';
    this.showDate.set({year});
    this.render();
  }

  showMonths() {
    this.view = 'month';
  }

  showYears() {
    this.view = 'year';

    let year = this.showDate.get('year');
    this.years = [year];
    for (let i = 0; i < 50; i++) {
      this.years.unshift(year - i)
      this.years.push(year + i)
    }
  }
}
