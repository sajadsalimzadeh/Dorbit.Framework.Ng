import {Component, ElementRef, EventEmitter, Injector, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import moment from 'jalali-moment';
import {Moment} from 'jalali-moment';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {OverlayAlignments, OverlayRef, OverlayService} from "../../overlay/overlay.component";
import {FormControl} from "@angular/forms";
import {Direction} from "../../../types";
import {DialogRef, DialogService} from "../../dialog/services/dialog.service";

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

  dayOfWeakName?: string;
}

@Component({
  selector: 'd-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['../control.scss', './date-picker.component.scss'],
  providers: [createControlValueAccessor(DatePickerComponent)]
})
export class DatePickerComponent extends AbstractFormControl<any> {
  override dir: Direction = 'ltr';

  @Input() displayFormat = 'YYYY/MM/DD HH:mm:ss';
  @Input() valueFormat = 'YYYY-MM-DDTHH:mm:ssZ';
  @Input() locale: 'fa' | 'en' = 'fa';
  @Input() textAlign: '' | 'left' | 'center' | 'right' = '';
  @Input() alignment: OverlayAlignments = 'bottom-center';
  @Input() openMode: 'auto' | 'type' | 'select' = 'auto';
  @Input() icon?: string;
  @Input() iconPos: 'start' | 'end' = 'start';
  @Input() clearable = true;
  @Input() future = true;

  @Output() onLeave = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<string>();

  @ViewChild('desktopTpl') desktopTpl!: TemplateRef<any>
  @ViewChild('mobileTpl') mobileTpl!: TemplateRef<any>
  @ViewChild('yearPickerEl') yearPickerEl?: ElementRef<HTMLDivElement>;
  @ViewChild('mobileViewDateEl') mobileViewDateEl?: ElementRef<HTMLDivElement>;

  isJalali() {
    return this.locale == 'fa';
  }

  isMobileView() {
    return window.innerWidth < 600;
  }

  override onClick(e: MouseEvent) {
    e.stopPropagation();
    super.onClick(e);
    this.open();
  }

  override onFocus(e: FocusEvent) {
    super.onFocus(e);
    e.preventDefault();
    this.open();
  }

  view: ViewMode = 'calendar';
  pickerClasses: any = {};

  overlayRef?: OverlayRef;
  mobileDialog?: DialogRef;

  todayDate!: Moment;
  selectedDate!: Moment;

  todayValue!: DateValue;
  selectedValue!: DateValue;

  weekDays: string[] = [];
  years: number[] = [];
  months: string[] = [];
  days: number[] = [];
  dates: DateValue[] = [];

  displayFormControl = new FormControl('');

  constructor(
    injector: Injector,
    private dialogService: DialogService,
    private overlayService: OverlayService,
  ) {
    super(injector)
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscription.add(this.formControl.valueChanges.subscribe(e => {
      this.renderDisplayValue()
    }));
    this.renderDisplayValue();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.isMobileView() && this.inputEl) {
      this.inputEl.nativeElement.readOnly = true;
    }
  }

  protected getDayName(date: DateValue) {
    const dateStr = `${date.year}/${(date.month > 8 ? '' : '0') + (date.month + 1)}/${(date.day > 9 ? '' : '0') + date.day}`;
    return moment.from(dateStr, this.locale).locale('fa').format('dddd');
  }

  private getMoment() {
    return moment().locale(this.locale);
  }

  override init() {
    super.init();
    this.todayDate = this.getMoment();
    this.todayValue = this.getDateTime(this.todayDate);

    let firstDayOfWeek = this.getMoment().startOf('month');
    while (firstDayOfWeek.get('weekday') > 0) firstDayOfWeek.add(-1, 'day');
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(firstDayOfWeek.format('dd'));
      firstDayOfWeek.add(1, 'day');
    }

    this.months = [];
    const monthMoment = this.getMoment().startOf('year');
    for (let i = 0; i < 12; i++) {
      this.months.push(monthMoment.format('MMMM'));
      monthMoment.add(1, 'month');
    }

    this.pickerClasses['dir-ltr'] = !this.isJalali();
    this.pickerClasses['dir-rtl'] = !this.pickerClasses['dir-ltr'];
    this.pickerClasses[this.size] = true;

    this.render();
  }

  onInputChange(e: Event) {
    const input = (e.target as HTMLInputElement);
    if (input) {
      this.selectedDate = moment.from(input.value, this.locale, this.displayFormat);
      this.formControl.setValue(this.selectedDate.locale('en').format(this.valueFormat))
    }
    this.render();
  }

  renderDisplayValue() {
    try {
      let m = moment.from(this.formControl.value, 'en', this.valueFormat).locale(this.locale);
      this.displayFormControl.setValue(m.isValid() ? m.format(this.displayFormat) : '');
    } catch {
      this.displayFormControl.setValue('');
    }
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
    if (!this.selectedDate) this.selectedDate = moment();
    try {
      this.selectedDate.format(this.valueFormat)
    } catch {
      this.selectedDate = moment();
    }
    super.render();
    this.selectedValue = this.getDateTime(this.selectedDate);
    this.createDates();
  }

  createDates() {
    if (!this.overlayRef) return;
    this.selectedDate = this.selectedDate.locale(this.locale);
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

  createDays() {
    this.days = [];
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
  }

  selectDate(date: DateValue) {
    this.selectedDate = this.getMoment();
    if (this.isJalali()) {
      this.selectedDate.jDate(date.day);
      this.selectedDate.jMonth(date.month);
      this.selectedDate.jYear(date.year);
    } else {
      this.selectedDate.date(date.day);
      this.selectedDate.month(date.month);
      this.selectedDate.year(date.year);
    }
    const value = this.selectedDate.locale('en').format(this.valueFormat);
    this.formControl.setValue(value);
    this.selectedValue = date;
    this.render();
    this.close();

    this.onSelect.emit(value)
  }

  selectMonth(month: number) {
    this.view = 'calendar';
    if (this.isJalali()) this.selectedDate.jMonth(month);
    else this.selectedDate.month(month);
    this.render();
  }

  selectYear(year: number) {
    this.view = 'month';
    if (this.isJalali()) this.selectedDate.jYear(year);
    else this.selectedDate.year(year);
    this.render();
  }

  clear() {
    this.formControl.setValue('');
    setTimeout(() => {
      this.close();
    }, 10)
  }

  showMonths() {
    this.view = 'month';
  }

  createYears() {
    let year = moment().locale(this.locale).get('year');
    this.years = [year];
    for (let i = 1; i < 100; i++) {
      this.years.unshift(year - i)
      if (this.future) this.years.push(year + i)
    }
  }

  showYears() {
    this.view = 'year';

    this.createYears();
    const yearsEl = this.yearPickerEl?.nativeElement;
    if (yearsEl) {
      setTimeout(() => {
        const activeEl = yearsEl.querySelector('.active') as HTMLElement;
        if (activeEl) {
          yearsEl.scrollTo({top: activeEl.offsetTop, behavior: 'smooth'});
        }
      }, 100);
    }
  }

  open() {
    if (!this.overlayRef && this.formControl.enabled) {
      if (this.isMobileView()) {
        if(this.mobileDialog) return;
        this.mobileDialog = this.dialogService.open({
          width: '100%',
          closable: false,
          position: 'bottom-center',
          template: this.mobileTpl,
          ngClass: 'date-picker-dialog'
        });
        this.mobileDialog.onClose.subscribe(res => this.mobileDialog = undefined)
        this.createDays();
        this.createYears();

        setTimeout(() => {
          if (this.selectedDate) {
            const m = this.selectedDate.locale(this.locale);
            this.setMobileItem({
              year: m.year(),
              month: m.month(),
              day: m.date(),
            });
          }
        }, 200)
      } else {
        this.overlayRef = this.overlayService.create({
          autoClose: false,
          template: this.desktopTpl,
          alignment: this.alignment,
          ref: this.elementRef.nativeElement
        });
      }

      this.overlayRef?.onDestroy.subscribe(() => this.overlayRef = undefined);

      if (this.openMode == 'select') {
        setTimeout(() => {
          this.inputEl?.nativeElement?.blur();
        }, 200);
      }
    }
    this.render();
  }

  close() {
    this.overlayRef?.destroy();
  }

  processMobileItemsTimeout: any;

  processMobileItems() {
    if (!this.mobileViewDateEl) return {day: 0, month: 0, year: 0};
    const el = this.mobileViewDateEl.nativeElement;
    const daysScrollBoxEl = el.querySelector('.days .scroll-box') as HTMLDivElement;
    const monthsScrollBoxEl = el.querySelector('.months .scroll-box') as HTMLDivElement;
    const yearsScrollBoxEl = el.querySelector('.years .scroll-box') as HTMLDivElement;

    const dayIndex = Math.max(Math.min(Math.round(daysScrollBoxEl.scrollTop / 50), this.days.length - 1), 0);
    const monthIndex = Math.max(Math.min(Math.round(monthsScrollBoxEl.scrollTop / 50), this.months.length - 1), 0);
    const yearIndex = Math.max(Math.min(Math.round(yearsScrollBoxEl.scrollTop / 50), this.years.length - 1), 0);

    clearTimeout(this.processMobileItemsTimeout);
    this.processMobileItemsTimeout = setTimeout(() => {
      daysScrollBoxEl.scrollTo({top: dayIndex * 50, behavior: 'smooth'});
      monthsScrollBoxEl.scrollTo({top: monthIndex * 50, behavior: 'smooth'});
      yearsScrollBoxEl.scrollTo({top: yearIndex * 50, behavior: 'smooth'});
    }, 200)

    this.selectedValue = {day: this.days[dayIndex], month: monthIndex, year: this.years[yearIndex]};
    this.selectedValue.dayOfWeakName = this.getDayName(this.selectedValue);
    return this.selectedValue;
  }

  setMobileItem(date?: { day?: number, month?: number, year?: number }) {
    if (!date || !this.mobileViewDateEl) return;
    const el = this.mobileViewDateEl.nativeElement;
    const daysScrollBoxEl = el.querySelector('.days .scroll-box') as HTMLDivElement;
    const monthsScrollBoxEl = el.querySelector('.months .scroll-box') as HTMLDivElement;
    const yearsScrollBoxEl = el.querySelector('.years .scroll-box') as HTMLDivElement;

    if (typeof date.day === 'number') {
      const index = date.day - 1;
      daysScrollBoxEl.scrollTop = index * 50;
    }

    if (typeof date.month === 'number') {
      const index = date.month;
      monthsScrollBoxEl.scrollTop = index * 50;
    }

    if (typeof date.year === 'number') {
      const index = this.years.indexOf(date.year);
      yearsScrollBoxEl.scrollTop = index * 50;
    }
  }

  selectMobileItem(dialog: DialogRef) {
    const selectedDate = this.processMobileItems();
    this.selectDate(selectedDate)
    dialog.close();
  }

  selectMobileItemToday() {
    const m = moment().locale(this.locale);
    this.setMobileItem({
      year: m.year(),
      month: m.month(),
      day: m.date(),
    });
  }
}
