import {Component, ElementRef, EventEmitter, HostListener, Injector, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import * as moment from 'jalali-moment';
import {Moment} from 'jalali-moment';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {OverlayRef, OverlayService} from "../../overlay/overlay.service";
import {OverlayAlignments} from "../../overlay/overlay.component";
import {FormControl} from "@angular/forms";

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
  @Input() displayFormat = 'YYYY/MM/DD HH:mm:ss';
  @Input() valueFormat = 'YYYY/MM/DD HH:mm:ss';
  @Input() locale?: string;
  @Input() alignment: OverlayAlignments = 'start-bottom';

  @Output() onLeave = new EventEmitter<any>();
  @Output() onChooseDate = new EventEmitter<string>();

  @ViewChild('pickerTpl') pickerTpl?: TemplateRef<any>
  @ViewChild('yearPickerEl') yearPickerEl?: ElementRef<HTMLDivElement>;

  @HostListener('window:click', ['$event'])
  onWindowClick() {
    this.close();
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

  todayValue!: DateValue;
  selectedValue!: DateValue;

  weekDays: string[] = [];
  years: number[] = [];
  months: string[] = [];
  dates: DateValue[] = [];

  displayFormControl = new FormControl('');

  constructor(
    injector: Injector,
    private overlayService: OverlayService,
  ) {
    super(injector)
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscription.add(this.formControl.valueChanges.subscribe(e => {
      try {
        let m = moment.from(e, 'en', this.valueFormat);
        if (this.type == 'jalali') {
          m = m.locale('fa');
        }
        this.displayFormControl.setValue(m.format(this.displayFormat));
      } catch {
        this.displayFormControl.setValue('');
      }
    }));
  }

  private getLocale() {
    return this.locale ?? (this.type == 'jalali' ? 'fa' : 'en');
  }

  override init() {
    super.init();
    this.todayDate = moment().locale(this.getLocale());
    this.todayValue = this.getDateTime(this.todayDate);

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

    this.pickerClasses['dir-ltr'] = this.type != 'jalali';
    this.pickerClasses['dir-rtl'] = this.type == 'jalali';
    this.pickerClasses[this.size] = true;

    this.render();
  }


  onInputChange(e: Event) {
    const input = (e.target as HTMLInputElement);
    if (input) {
      if(this.type == 'jalali') {
        this.selectedDate = moment.from(input.value, 'fa', this.displayFormat);
      } else {
        this.selectedDate = moment.from(input.value, 'en', this.displayFormat);
      }
    }
    this.formControl.setValue(this.selectedDate.locale('en').format(this.valueFormat))

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
    if (!this.selectedDate) this.selectedDate = moment();
    this.selectedValue = this.getDateTime(this.selectedDate);
    this.createDays();
  }

  createDays() {
    if (!this.overlayRef) return;
    this.selectedDate = this.selectedDate.locale(this.getLocale());
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
    this.selectedDate = moment();
    if (this.type == 'jalali') {
      this.selectedDate.jDate(date.day);
      this.selectedDate.jMonth(date.month);
      this.selectedDate.jYear(date.year);
    } else {
      this.selectedDate.date(date.day);
      this.selectedDate.month(date.month);
      this.selectedDate.year(date.year);
    }
    this.formControl.setValue(this.selectedDate.locale('en').format(this.valueFormat));
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
    this.formControl.setValue('');
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
        autoClose: false,
        template: this.pickerTpl,
        alignment: this.alignment,
        ref: this.elementRef.nativeElement
      });
      this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
    }
    this.render();
  }

  close() {
    this.overlayRef?.destroy();
  }
}
