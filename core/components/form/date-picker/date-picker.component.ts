import {Component, ElementRef, EventEmitter, Injector, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import moment, {Moment} from 'jalali-moment';
import {AbstractControl, createControlValueAccessor} from "../abstract-control.directive";
import {OverlayAlignments, OverlayRef, OverlayService} from "../../overlay/overlay.component";
import {FormControl, FormsModule} from "@angular/forms";
import {Direction} from "../../../types";
import {DialogRef, DialogService} from "../../dialog/services/dialog.service";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

type ViewMode = 'calendar' | 'month' | 'year';

interface DateValue {
    year: number,
    month: number,
    day: number,
    hour: number;
    minute: number;
    second: number;

    isToday?: boolean;
    isHoliday?: boolean;
    isSelected?: boolean;
    isCurrentMonth?: boolean;

    dayOfWeakName?: string;
}

const mobileScrollItemHeight = 40;

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
    ],
    selector: 'd-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['../control.scss', './date-picker.component.scss'],
    providers: [createControlValueAccessor(DatePickerComponent)]
})
export class DatePickerComponent extends AbstractControl<any> {
    override dir: Direction = 'ltr';

    @Input() displayFormat = 'YYYY/MM/DD HH:mm:ss';
    @Input() valueFormat = 'YYYY-MM-DDTHH:mm:ss';
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
    hours: number[] = [];
    minutes: number[] = [];
    seconds: number[] = [];
    dates: DateValue[] = [];
    displayFormControl = new FormControl('');
    processMobileItemsTimeout: any;

    constructor(
        injector: Injector,
        private dialogService: DialogService,
        private overlayService: OverlayService,
    ) {
        super(injector)
    }

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

    override ngOnInit() {
        super.ngOnInit();

        for (let i = 0; i < 60; i++) this.seconds.push(i);
        for (let i = 0; i < 60; i++) this.minutes.push(i);
        for (let i = 0; i < 24; i++) this.hours.push(i);

        this.subscription.add(this.formControl.valueChanges.subscribe(e => {
            this.renderDisplayControl()
        }));
        this.renderDisplayControl();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();

        if (this.isMobileView() && this.inputEl) {
            this.inputEl.nativeElement.readOnly = true;
        }
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

    renderValueControl() {
        this.renderSelectedDate();
        this.formControl.setValue(this.selectedDate.locale('en').format(this.valueFormat))
        this.render();
    }

    renderSelectedDate() {
        const value = this.inputEl?.nativeElement.value ?? '';
        if (value) {
            this.selectedDate = moment.from(value, this.locale, this.displayFormat);
        }
    }

    renderDisplayControl() {
        try {
            let m = moment.from(this.formControl.value, 'en', this.valueFormat).locale(this.locale);
            this.displayFormControl.setValue(m.isValid() ? m.format(this.displayFormat) : '');
        } catch {
            this.displayFormControl.setValue('');
        }
    }

    getDateTime(date: Moment): DateValue {
        return {
            second: date.second(),
            minute: date.minute(),
            hour: date.hour(),
            day: date.date(),
            month: date.month(),
            year: date.year(),
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
        this.selectedValue.dayOfWeakName = this.getDayName(this.selectedValue);
        this.createDates();
    }

    createDates() {
        if (!this.overlayRef) return;
        this.selectedDate = this.selectedDate.locale(this.locale);
        let date = this.selectedDate.clone();
        const second = date.second();
        const minute = date.minute();
        const hour = date.hour();

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
                second: second,
                minute: minute,
                hour: hour,
                day: prevMonthDayCount - i,
                month: prevMonthMonth,
                year: prevMonthYear,
                isCurrentMonth: false,
            });
        }

        //Current Month Dates
        const curtMonthYear = date.get('year');
        const curtMonthMonth = date.get('month');
        for (let i = 1; i <= curtMonthDayCount; i++) {
            this.dates.push({
                second: second,
                minute: minute,
                hour: hour,
                day: i,
                month: curtMonthMonth,
                year: curtMonthYear,
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
                second: second,
                minute: minute,
                hour: hour,
                day: i,
                month: nextMonthMonth,
                year: nextMonthYear,
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
        this.selectedDate.second(date.second);
        this.selectedDate.minute(date.minute);
        this.selectedDate.hour(date.hour);

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
        this.selectedValue.dayOfWeakName = this.getDayName(this.selectedValue);
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
                this.renderSelectedDate();
                if (this.mobileDialog) return;
                this.mobileDialog = this.dialogService.open({
                    width: '100%',
                    closable: false,
                    maskClosable: true,
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
                            second: m.second(),
                            minute: m.minute(),
                            hour: m.hour(),
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

    processMobileItems() {
        if (!this.mobileViewDateEl) return {second: 0, minute: 0, hour: 0, day: 0, month: 0, year: 0};
        const el = this.mobileViewDateEl.nativeElement;
        const secondsScrollBoxEl = el.querySelector('.seconds .scroll-box') as HTMLDivElement;
        const minutesScrollBoxEl = el.querySelector('.minutes .scroll-box') as HTMLDivElement;
        const hoursScrollBoxEl = el.querySelector('.hours .scroll-box') as HTMLDivElement;
        const daysScrollBoxEl = el.querySelector('.days .scroll-box') as HTMLDivElement;
        const monthsScrollBoxEl = el.querySelector('.months .scroll-box') as HTMLDivElement;
        const yearsScrollBoxEl = el.querySelector('.years .scroll-box') as HTMLDivElement;

        const secondIndex = Math.max(Math.min(Math.round(secondsScrollBoxEl.scrollTop / mobileScrollItemHeight), this.seconds.length - 1), 0);
        const minuteIndex = Math.max(Math.min(Math.round(minutesScrollBoxEl.scrollTop / mobileScrollItemHeight), this.minutes.length - 1), 0);
        const hourIndex = Math.max(Math.min(Math.round(hoursScrollBoxEl.scrollTop / mobileScrollItemHeight), this.hours.length - 1), 0);
        const dayIndex = Math.max(Math.min(Math.round(daysScrollBoxEl.scrollTop / mobileScrollItemHeight), this.days.length - 1), 0);
        const monthIndex = Math.max(Math.min(Math.round(monthsScrollBoxEl.scrollTop / mobileScrollItemHeight), this.months.length - 1), 0);
        const yearIndex = Math.max(Math.min(Math.round(yearsScrollBoxEl.scrollTop / mobileScrollItemHeight), this.years.length - 1), 0);

        clearTimeout(this.processMobileItemsTimeout);
        this.processMobileItemsTimeout = setTimeout(() => {
            secondsScrollBoxEl.scrollTo({top: secondIndex * mobileScrollItemHeight, behavior: 'smooth'});
            minutesScrollBoxEl.scrollTo({top: minuteIndex * mobileScrollItemHeight, behavior: 'smooth'});
            hoursScrollBoxEl.scrollTo({top: hourIndex * mobileScrollItemHeight, behavior: 'smooth'});
            daysScrollBoxEl.scrollTo({top: dayIndex * mobileScrollItemHeight, behavior: 'smooth'});
            monthsScrollBoxEl.scrollTo({top: monthIndex * mobileScrollItemHeight, behavior: 'smooth'});
            yearsScrollBoxEl.scrollTo({top: yearIndex * mobileScrollItemHeight, behavior: 'smooth'});
        }, 200);

        this.selectedValue = {
            second: this.seconds[secondIndex],
            minute: this.minutes[minuteIndex],
            hour: this.hours[hourIndex],
            day: this.days[dayIndex],
            month: monthIndex,
            year: this.years[yearIndex]
        };
        this.selectedValue.dayOfWeakName = this.getDayName(this.selectedValue);
        return this.selectedValue;
    }

    setMobileItem(date?: { second?: number, minute?: number, hour?: number, day?: number, month?: number, year?: number }) {
        if (!date || !this.mobileViewDateEl) return;
        const el = this.mobileViewDateEl.nativeElement;

        if (typeof date.second === 'number') {
            const index = date.second;
            const secondsScrollBoxEl = el.querySelector('.seconds .scroll-box') as HTMLDivElement;
            secondsScrollBoxEl.scrollTop = index * mobileScrollItemHeight;
        }

        if (typeof date.minute === 'number') {
            const index = date.minute;
            const minutesScrollBoxEl = el.querySelector('.minutes .scroll-box') as HTMLDivElement;
            minutesScrollBoxEl.scrollTop = index * mobileScrollItemHeight;
        }

        if (typeof date.hour === 'number') {
            const index = date.hour;
            const hoursScrollBoxEl = el.querySelector('.hours .scroll-box') as HTMLDivElement;
            hoursScrollBoxEl.scrollTop = index * mobileScrollItemHeight;
        }

        if (typeof date.day === 'number') {
            const index = date.day - 1;
            const daysScrollBoxEl = el.querySelector('.days .scroll-box') as HTMLDivElement;
            daysScrollBoxEl.scrollTop = index * mobileScrollItemHeight;
        }

        if (typeof date.month === 'number') {
            const index = date.month;
            const monthsScrollBoxEl = el.querySelector('.months .scroll-box') as HTMLDivElement;
            monthsScrollBoxEl.scrollTop = index * mobileScrollItemHeight;
        }

        if (typeof date.year === 'number') {
            const index = this.years.indexOf(date.year);
            const yearsScrollBoxEl = el.querySelector('.years .scroll-box') as HTMLDivElement;
            yearsScrollBoxEl.scrollTop = index * mobileScrollItemHeight;
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
            second: m.second(),
            minute: m.minute(),
            hour: m.hour(),
            year: m.year(),
            month: m.month(),
            day: m.date(),
        });
    }

    protected getDayName(date: DateValue) {
        const dateStr = `${date.year}/${(date.month > 8 ? '' : '0') + (date.month + 1)}/${(date.day > 9 ? '' : '0') + date.day}`;
        return moment.from(dateStr, this.locale).locale('fa').format('dddd');
    }

    private getMoment() {
        return moment().locale(this.locale);
    }
}
