import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostListener, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import moment, { Moment } from 'jalali-moment';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PrimengControlComponent } from '../primeng-control.component';
import { Popover, PopoverModule } from "primeng/popover";
import { IftaLabel } from "primeng/iftalabel";

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
    value: number;

    isDisabled?: boolean;
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
    imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, InputIconModule, PopoverModule, IconFieldModule, IftaLabel],
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
export class JalaliDatePickerComponent extends PrimengControlComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() label: string = '';
    @Input() size?: 'small' | 'large';
    @Input() showClear: boolean = false;
    @Input() displayFormat!: string;
    @Input() valueFormat!: string;
    @Input() min?: string | null;
    @Input() max?: string | null;
    @Input() showTimePicker: boolean = false;
    @Input() inputStyleClass: string = '';

    @Output() onSelect = new EventEmitter();

    @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;
    @ViewChild('op') popover!: Popover;

    displayValue: string = '';

    monthNames = monthNames;
    isInside: boolean = false;
    state: 'date' | 'month' | 'year' = 'date';
    year: number = 0;
    years: YearObject[] = [];
    month: number = 0;
    months: MonthObject[] = [];
    date?: Moment;
    dates: DateObject[] = [];

    constructor(injector: Injector) {
        super(injector);
    }

    @HostListener('mouseenter') onEnter() {
        this.isInside = true;
    }

    @HostListener('mouseleave') onLeave() {
        this.isInside = false;
    }

    override ngOnInit() {
        super.ngOnInit();

        if (this.showTimePicker) {
            this.displayFormat ??= 'jYYYY/jMM/jDD HH:mm:ss';
            this.valueFormat ??= 'YYYY-MM-DDTHH:mm:ssZ';
        } else {
            this.displayFormat ??= 'jYYYY/jMM/jDD';
            this.valueFormat ??= 'YYYY-MM-DD';
        }

        this.updateDisplayFromValue();
    }

    ngAfterViewInit() {

        this.subscription.add(this.popover.onShow.subscribe(e => {
            this.createDays();
        }))

    }

    override writeValue(value: any): void {
        super.writeValue(value);
        this.updateDisplayFromValue();
    }

    updateDisplayFromValue() {
        try {
            this.date = moment.from(this.value, 'en', this.valueFormat);
            if (!(this.date as any)._isValid) {
                this.date = undefined;
            }

            this.displayValue = this.date?.format(this.displayFormat) ?? '';
        } catch {
        }
    }

    updateValueFromDisplay() {

        try {
            const value = this.displayValue;
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
        const previousDays = m.jDay()
        m.add(-previousDays, 'day')

        const dates: DateObject[] = [];
        for (let i = 0; i < previousDays; i++) {
            dates.push({
                year: m.jYear(),
                month: m.jMonth(),
                day: m.jDate(),
                value: m.valueOf(),

                isCurrentMonth: false,
            })
            m.add(1, 'day');
        }

        for (let i = 0; i < daysInMonth; i++) {
            dates.push({
                year: m.jYear(),
                month: m.jMonth(),
                day: m.jDate(),
                value: m.valueOf(),
                isCurrentMonth: true,
            })
            m.add(1, 'day');
        }

        while (dates.length % 7 != 0) {
            dates.push({
                year: m.jYear(),
                month: m.jMonth(),
                day: m.jDate(),
                value: m.valueOf(),

                isCurrentMonth: false,
            })
            m.add(1, 'day');
        }

        const minValue = this.min ? moment(this.min, this.valueFormat).valueOf() : 0;
        const maxValue = this.max ? moment(this.max, this.valueFormat).valueOf() : 100000000000000;

        dates.forEach(date => {
            if (date.day == toDay && date.month == toMonth && date.year == toYear) {
                date.isToday = true;
            }

            if (date.day == day && date.month == this.month && date.year == this.year) {
                date.isSelected = true;
            }

            date.isDisabled = (date.value < minValue || date.value > maxValue);
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
            const yearPickerEl = document.querySelector('.date-picker-container .year-picker') as HTMLDivElement;
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
        if (date.isDisabled) return;

        this.date ??= moment();
        this.date.jDate(date.day);
        this.date.jMonth(date.month);
        this.date.jYear(date.year);
        this.select();
    }

    select() {
        this.date ??= moment();
        this.displayValue = this.date.format(this.displayFormat);
        if (this.onChange) this.onChange(this.date.format(this.valueFormat));
        this.onSelect.emit();
        if (!this.showTimePicker) {
            this.popover.hide();
        } else {
            this.createDays();
        }
    }
}
