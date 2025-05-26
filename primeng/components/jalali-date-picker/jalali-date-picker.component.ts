import {Component, ElementRef, forwardRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import moment, {Moment} from 'jalali-moment';
import {Subscription} from 'rxjs';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';

interface YearObject {
    value: number;
    isSelected?: boolean;
}

interface MonthObject {
    value: number;
    name: string;

    isSelected?: boolean;
}

interface DateObject {
    year: number;
    month: number;
    day: number;

    isToday?: boolean;
    isSelected?: boolean;
    isCurrentMonth?: boolean;
}


const monthNames = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
]

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule],
    selector: 'p-jalali-date-picker',
    templateUrl: './jalali-date-picker.component.html',
    styleUrls: ['./jalali-date-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => JalaliDatePickerComponent),
            multi: true,
        }
    ],
})
export class JalaliDatePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input({required: true}) formControl!: FormControl;
    @Input() placeholder: string = '';
    // @Input() displayFormat: string = 'jYYYY/jMM/jDD HH:mm:ss'; //Format time dar
    @Input() displayFormat: string = 'jYYYY/jMM/jDD';
    @Input() valueFormat: string = 'YYYY-MM-DD';

    @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;
    subscription = new Subscription();
    monthNames = monthNames;
    displayFormControl = new FormControl('');
    isInside: boolean = false;
    isOpen: boolean = false;
    state: 'date' | 'month' | 'year' = 'date';
    year: number = 0;
    years: YearObject[] = [];
    month: number = 0;
    months: MonthObject[] = [];
    date?: Moment;
    dates: DateObject[] = [];
    onTouch: any;
    onChange: any;

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('mouseenter') onEnter() {
        this.isInside = true;
    }

    @HostListener('mouseleave') onLeave() {
        this.isInside = false;
    }

    ngOnInit(): void {

        this.subscription.add(this.formControl.valueChanges.subscribe(e => {
            this.updateDateFromFormControlValue();
        }));

        this.updateDateFromFormControlValue();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    writeValue(obj: any): void {
        this.formControl.setValue(obj)
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) this.displayFormControl.disable();
        else this.displayFormControl.enable();
    }

    updateDateFromFormControlValue() {
        try {
            this.date = moment.from(this.formControl.getRawValue(), 'en', this.valueFormat);
            if (!(this.date as any)._isValid) {
                this.date = undefined;
            }

            this.displayFormControl.setValue(this.date?.format(this.displayFormat) ?? '');
        } catch {
        }
    }

    updateValueFromDisplay() {

        try {
            const value = this.displayFormControl.getRawValue();
            if (value) {
                const m = moment.from(value, 'en', this.displayFormat);
                if ((m as any)._isValid) {
                    this.date = m;
                    this.createDays();
                }
            }
        } catch {
        }
    }

    focus() {
        this.inputEl.nativeElement.focus();
    }

    open() {
        this.createDays();
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
        this.formControl.setValue(this.date?.format(this.valueFormat));
    }

    onBlur() {
        if (!this.isInside) {
            this.close();
        } else {
            setTimeout(() => {
                if (!this.isOpen) {
                    this.focus();
                }
            }, 10);
        }
    }

    createDays() {
        const now = moment();
        const toDay = now.jDate();
        const toMonth = now.jMonth();
        const toYear = now.jYear();

        const date = this.date?.clone() ?? moment();

        this.year = date.jYear();
        this.month = date.jMonth();
        const day = date.jDate();
        const daysInMonth = date.jDaysInMonth();

        const m = moment.from(`${this.year}-${this.month + 1}-1`, 'fa');
        const previouseDays = m.jDay()
        m.add(-previouseDays, 'day')

        const dates: DateObject[] = [];
        for (let i = 0; i < previouseDays; i++) {
            dates.push({
                year: m.jYear(),
                month: m.jMonth(),
                day: m.jDate(),

                isCurrentMonth: false,
            })
            m.add(1, 'day');
        }

        for (let i = 0; i < daysInMonth; i++) {
            dates.push({
                year: m.jYear(),
                month: m.jMonth(),
                day: m.jDate(),
                isCurrentMonth: true,
            })
            m.add(1, 'day');
        }

        while (dates.length % 7 != 0) {
            dates.push({
                year: m.jYear(),
                month: m.jMonth(),
                day: m.jDate(),

                isCurrentMonth: false,
            })
            m.add(1, 'day');
        }

        dates.forEach(date => {
            if (date.day == toDay && date.month == toMonth && date.year == toYear) {
                date.isToday = true;
            }

            if (date.day == day && date.month == this.month && date.year == this.year) {
                date.isSelected = true;
            }
        })

        this.dates = dates;
    }

    openMonthPicker() {
        this.state = 'month';
        this.createMonths();
    }

    createMonths() {
        this.month = (this.date ?? moment()).jMonth();
        this.months = [];
        for (let i = 0; i < 12; i++) {
            this.months.push({
                value: i,
                name: monthNames[i],

                isSelected: this.month == i
            })
        }
    }

    openYearPicker() {
        this.createYears();
        this.state = 'year';

        setTimeout(() => {
            const yearPickerEl = this.elementRef.nativeElement.querySelector('.year-picker') as HTMLDivElement;
            if (yearPickerEl) {
                yearPickerEl.scrollTo({
                    top: yearPickerEl.scrollHeight / 2 - (yearPickerEl.clientHeight / 2),
                    behavior: 'instant'
                });
            }
        }, 200);
    }

    createYears() {
        this.year = (this.date ?? moment()).jYear();
        this.years = [];
        for (let i = this.year - 100; i < this.year + 100; i++) {
            this.years.push({
                value: i,
                isSelected: i == this.year
            });
        }
    }

    goToday() {
        this.date = moment();
        this.createDays();
    }

    selectYear(value: number) {
        this.date ??= moment();
        this.date.jYear(value);
        this.openMonthPicker();
        this.createDays();
    }

    selectMonth(value: number) {
        this.date ??= moment();
        this.date.jMonth(value);
        this.state = 'date';
        this.createDays();
    }

    selectDate(date: DateObject) {
        this.date ??= moment();
        this.date.jDate(date.day);
        this.date.jMonth(date.month);
        this.date.jYear(date.year);

        const m = (this.date?.clone() ?? moment()).locale('en');
        this.formControl.setValue(m.format(this.valueFormat));
        this.displayFormControl.setValue(m.format(this.displayFormat));

        setTimeout(() => {
            this.isOpen = false;
        }, 50);
    }
}
