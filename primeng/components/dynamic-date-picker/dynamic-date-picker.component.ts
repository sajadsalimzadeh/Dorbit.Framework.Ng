import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostListener, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PrimengControlComponent } from '../primeng-control.component';
import { Popover, PopoverModule } from "primeng/popover";
import moment, { Moment } from 'jalali-moment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, InputIconModule, PopoverModule, IconFieldModule, TranslateModule],
    selector: 'p-dynamic-date-picker',
    templateUrl: './dynamic-date-picker.component.html',
    styleUrls: ['./dynamic-date-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DynamicDatePickerComponent),
            multi: true,
        }
    ],
})
export class DynamicDatePickerComponent extends PrimengControlComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() label: string = '';
    @Input() locale!: string;
    @Input() size?: 'small' | 'large';
    @Input() showClear: boolean = false;
    @Input() displayFormat!: string;
    @Input() valueFormat!: string;
    @Input() min?: string | null;
    @Input() max?: string | null;
    @Input() showTimePicker: boolean = false;
    @Input() inputStyleClass: string = '';

    @Output() onSelect = new EventEmitter();

    @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;
    @ViewChild('op', { static: true }) popover!: Popover;

    displayValue: string = '';

    isInside: boolean = false;
    state: 'date' | 'month' | 'year' = 'date';
    year: number = 0;
    years: YearObject[] = [];
    month?: MonthObject;
    months: MonthObject[] = [];
    date?: Moment;
    dates: DateObject[] = [];

    constructor(injector: Injector, private translateService: TranslateService) {
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

        const dateLocale = this.translateService.instant('date.locale');
        if (dateLocale != 'date.locale') this.locale = dateLocale;
        if (!this.locale) this.locale = 'fa';

        if (this.showTimePicker) {
            this.displayFormat ??= 'YYYY/MM/DD HH:mm:ss';
            this.valueFormat ??= 'YYYY-MM-DDTHH:mm:ss';
        } else {
            this.displayFormat ??= 'YYYY/MM/DD';
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

            this.displayValue = this.date?.clone().locale(this.locale).format(this.displayFormat) ?? '';
        } catch {
            this.date = moment();
        }
    }

    updateValueFromDisplay() {
        try {
            const value = this.displayValue;
            if (value) {
                const m = moment.from(value, this.locale, this.displayFormat);
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
        const date = (this.date?.clone() ?? moment()).locale(this.locale);

        this.year = date.year();
        this.month = {
            value: date.month(),
            name: date.format('MMMM'),
            isSelected: false,
        };
        const day = date.date();
        const daysInMonth = date.daysInMonth();

        const m = moment().locale(this.locale).set({ year: this.year, month: this.month.value, date: 1 });
        const previousDays = m.day();
        m.add(-previousDays, 'day')

        const dates: DateObject[] = [];
        for (let i = 0; i < previousDays; i++) {
            dates.push({
                year: m.year(),
                month: m.month(),
                day: m.date(),
                value: m.valueOf(),

                isCurrentMonth: false,
            })
            m.add(1, 'day');
        }

        for (let i = 0; i < daysInMonth; i++) {
            dates.push({
                year: m.year(),
                month: m.month(),
                day: m.date(),
                value: m.valueOf(),
                isCurrentMonth: true,
            })
            m.add(1, 'day');
        }

        while (dates.length % 7 != 0) {
            dates.push({
                year: m.year(),
                month: m.month(),
                day: m.date(),
                value: m.valueOf(),

                isCurrentMonth: false,
            })
            m.add(1, 'day');
        }

        const minValue = this.min ? moment(this.min, this.valueFormat).valueOf() : 0;
        const maxValue = this.max ? moment(this.max, this.valueFormat).valueOf() : 100000000000000;

        const now = moment().locale(this.locale);
        const toDay = now.date();
        const toMonth = now.month();
        const toYear = now.year();

        dates.forEach(date => {
            if (date.day == toDay && date.month == toMonth && date.year == toYear) {
                date.isToday = true;
            }

            if (date.day == day && date.month == this.month?.value && date.year == this.year) {
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
        const month = (this.date ?? moment()).locale(this.locale).month();
        let m = moment().locale(this.locale);
        m = m.subtract(m.month(), 'month');
        this.months = [];
        for (let i = 0; i < 12; i++) {
            this.months.push({
                value: m.month(),
                name: m.format('MMMM'),
                isSelected: month == m.month()
            });
            m = m.add(1, 'month');
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
        this.year = (this.date ?? moment()).locale(this.locale).year();
        this.years = [];
        for (let i = this.year - 100; i < this.year + 100; i++) {
            this.years.push({
                value: i,
                isSelected: i == this.year
            });
        }
    }

    goToday() {
        this.date = moment().locale(this.locale);
        this.createDays();
    }

    selectYear(value: number) {
        this.date ??= moment().locale(this.locale);
        this.date.set({ year: value });
        this.openMonthPicker();
        this.createDays();
    }

    selectMonth(value: number) {
        this.date ??= moment().locale(this.locale);
        this.date.set({ month: value });
        this.state = 'date';
        this.createDays();
    }

    selectDate(date: DateObject) {
        if (date.isDisabled) return;

        this.date = moment.unix(date.value / 1000);
        this.select();
    }

    select() {
        this.date ??= moment();
        this.displayValue = this.date.clone().locale(this.locale).format(this.displayFormat);
        if (this.onChange) this.onChange(this.date.format(this.valueFormat));
        this.onSelect.emit();
        if (!this.showTimePicker) {
            this.popover.hide();
        } else {
            this.createDays();
        }
    }
}
