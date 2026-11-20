import { Component, ElementRef, EventEmitter, forwardRef, Injector, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { TagModule } from 'primeng/tag';
import moment, { Moment } from 'jalali-moment';
import gregorianMoment from 'moment';
import { PrimengControlComponent } from '../primeng-control.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export interface DynamicDatePickerRangeValue {
    from: string | null;
    to: string | null;
}

interface CalendarDay {
    value: number;
    day: number;
    label: string;
    isCurrentMonth: boolean;
    isDisabled: boolean;
    isToday: boolean;
    isSelected: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isInRange: boolean;
}

type Endpoint = 'from' | 'to';
type TimeUnit = 'hour' | 'minute' | 'second';

@Component({
    standalone: true,
    selector: 'p-dynamic-date-picker-range',
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, PopoverModule, TagModule, IconFieldModule, InputIconModule],
    templateUrl: './dynamic-date-picker-range.component.html',
    styleUrls: ['./dynamic-date-picker-range.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DynamicDatePickerRangeComponent),
        multi: true
    }]
})
export class DynamicDatePickerRangeComponent extends PrimengControlComponent<DynamicDatePickerRangeValue | null> implements OnChanges {
    @Input() placeholder = '';
    @Input() label = '';
    @Input() locale = '';
    @Input() size?: 'small' | 'large';
    @Input() showClear = false;
    @Input() displayFormat?: string;
    @Input() valueFormat?: string;
    @Input() min?: string | null;
    @Input() max?: string | null;
    @Input() showTimePicker = false;
    @Input() inputStyleClass = '';
    @Output() onSelect = new EventEmitter<DynamicDatePickerRangeValue | null>();

    @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;
    @ViewChild('op', { static: true }) popover!: Popover;
    @ViewChild('yearPicker') yearPicker?: ElementRef<HTMLElement>;

    displayValue = '';
    state: 'date' | 'month' | 'year' = 'date';
    year = 0;
    month?: { value: number; name: string };
    months: { value: number; name: string; isSelected: boolean }[] = [];
    years: { value: number; isSelected: boolean }[] = [];
    dates: CalendarDay[] = [];
    weekdays: string[] = [];
    date?: Moment;
    nextEndpoint: Endpoint = 'from';
    activeEndpoint: Endpoint = 'from';
    readonly timeUnits: TimeUnit[] = ['hour', 'minute', 'second'];
    private fromDate?: Moment;
    private toDate?: Moment;
    private yearScrollTimer?: ReturnType<typeof setTimeout>;

    constructor(injector: Injector, private translateService: TranslateService) { super(injector); }

    get calendarLocale(): string {
        const translated = this.translateService.instant('date.locale');
        return this.locale || (translated !== 'date.locale' ? translated : 'fa');
    }

    get isPersian(): boolean { return this.calendarLocale.startsWith('fa'); }
    get displayPattern(): string { return this.displayFormat || (this.showTimePicker ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD'); }
    get valuePattern(): string { return this.valueFormat || (this.showTimePicker ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DD'); }
    get activeDate(): Moment | undefined { return this.activeEndpoint === 'from' ? this.fromDate : this.toDate; }
    get fromText(): string { return this.formatDisplay(this.fromDate); }
    get toText(): string { return this.formatDisplay(this.toDate); }

    override ngOnInit(): void {
        super.ngOnInit();
        this.updateDisplayFromValue();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['locale'] || changes['displayFormat'] || changes['valueFormat'] || changes['showTimePicker']) {
            this.updateDisplayFromValue();
        }
        this.createDays();
    }

    override writeValue(value: DynamicDatePickerRangeValue | null | undefined): void {
        // Do not retain the caller's object or emit changes from a model write.
        super.writeValue(value ? { from: value.from ?? null, to: value.to ?? null } : null);
        this.updateDisplayFromValue();
    }

    override setDisabledState(disabled: boolean): void {
        super.setDisabledState(disabled);
        if (disabled) this.popover?.hide();
    }

    private parse(value: string | null | undefined, locale: string, format: string): Moment | undefined {
        if (!value) return undefined;
        const parsed = moment.from(value, locale, format);
        return parsed.isValid() && parsed.clone().locale(locale).format(format) === value ? parsed : undefined;
    }

    private parseValue(value: string | null | undefined): Moment | undefined {
        const formatted = this.parse(value, 'en', this.valuePattern);
        if (formatted || !value) return formatted;
        // External models may include an ISO time even when this input displays dates only.
        // Keep display text strict; only model values and bounds receive this ISO fallback.
        // jalali-moment expands ISO_8601 to a single format requiring milliseconds
        // and an offset, so use Moment's strict ISO parser before wrapping the date.
        const iso = gregorianMoment(value, gregorianMoment.ISO_8601, 'en', true);
        return iso.isValid() ? moment(iso.toDate()).locale('en') : undefined;
    }

    private formatDisplay(date?: Moment): string {
        return date?.clone().locale(this.calendarLocale).format(this.displayPattern) ?? '';
    }

    private formatValue(date?: Moment): string | null {
        return date?.clone().locale('en').format(this.valuePattern) ?? null;
    }

    updateDisplayFromValue(): void {
        this.fromDate = this.parseValue(this.value?.from);
        this.toDate = this.parseValue(this.value?.to);
        this.nextEndpoint = this.fromDate && !this.toDate ? 'to' : 'from';
        this.activeEndpoint = this.toDate ? 'to' : 'from';
        this.date = (this.fromDate ?? this.toDate)?.clone().locale(this.calendarLocale);
        this.updateDisplay();
        this.createDays();
    }

    private updateDisplay(): void {
        this.displayValue = this.fromDate || this.toDate ? `${this.fromText} — ${this.toText}` : '';
    }

    updateValueFromDisplay(): void {
        if (this.isDisabled) return;
        const normalized = this.displayValue.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
            .replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
        const parts = normalized.split('—').map(part => part.trim());
        const from = this.parse(parts[0], this.calendarLocale, this.displayPattern);
        const to = this.parse(parts[1], this.calendarLocale, this.displayPattern);
        const valid = parts.length <= 2 && (!parts[0] || !!from) && (!parts[1] || !!to)
            && (!from || this.isWithinBounds(from)) && (!to || this.isWithinBounds(to));
        this.fromDate = valid ? from : undefined;
        this.toDate = valid ? to : undefined;
        this.nextEndpoint = this.fromDate && !this.toDate ? 'to' : 'from';
        this.activeEndpoint = this.toDate ? 'to' : 'from';
        this.date = (this.toDate ?? this.fromDate)?.clone().locale(this.calendarLocale);
        this.createDays();
        this.emitValue(false, false);
    }

    onBlur(): void {
        if (this.fromDate || this.toDate) this.updateDisplay();
        this.onTouched?.();
    }

    focus(): void { this.inputEl.nativeElement.focus(); }

    open(event: Event): void {
        if (this.isDisabled) return;
        this.state = 'date';
        this.createDays();
        this.popover.show(event, this.inputEl.nativeElement);
    }

    toggle(event: Event): void {
        if (this.isDisabled) return;
        this.state = 'date';
        this.createDays();
        this.popover.toggle(event, this.inputEl.nativeElement);
    }

    clear(): void {
        if (this.isDisabled) return;
        this.fromDate = this.toDate = this.date = undefined;
        this.nextEndpoint = this.activeEndpoint = 'from';
        this.createDays();
        this.emitValue(true);
    }

    private bounds(): { min?: Moment; max?: Moment } {
        const min = this.parseValue(this.min);
        const max = this.parseValue(this.max);
        return { min: this.showTimePicker ? min : min?.startOf('day'), max: this.showTimePicker ? max : max?.endOf('day') };
    }

    private isWithinBounds(value: Moment): boolean {
        const { min, max } = this.bounds();
        return (!min || value.valueOf() >= min.valueOf()) && (!max || value.valueOf() <= max.valueOf());
    }

    createDays(): void {
        const view = (this.date ?? this.fromDate ?? moment()).clone().locale(this.calendarLocale);
        this.year = view.year();
        this.month = { value: view.month(), name: view.format('MMMM') };
        const firstDay = view.localeData().firstDayOfWeek();
        this.weekdays = Array.from({ length: 7 }, (_, i) => view.clone().day((firstDay + i) % 7).format('dd'));
        const cursor = view.clone().startOf('month').startOf('day');
        const offset = (cursor.day() - firstDay + 7) % 7;
        const count = Math.ceil((offset + view.daysInMonth()) / 7) * 7;
        cursor.subtract(offset, 'day');
        const { min, max } = this.bounds();
        const from = this.fromDate?.clone().startOf('day').valueOf();
        const to = this.toDate?.clone().startOf('day').valueOf();
        const today = moment().startOf('day').valueOf();
        this.dates = Array.from({ length: count }, () => {
            const value = cursor.valueOf();
            const day: CalendarDay = {
                value, day: cursor.date(), label: cursor.format('YYYY/MM/DD'),
                isCurrentMonth: cursor.month() === view.month() && cursor.year() === view.year(),
                isDisabled: (!!min && cursor.clone().endOf('day').valueOf() < min.valueOf()) || (!!max && value > max.valueOf()),
                isToday: value === today,
                isSelected: value === from || value === to,
                isRangeStart: value === from,
                isRangeEnd: value === to,
                isInRange: from !== undefined && to !== undefined && value > Math.min(from, to) && value < Math.max(from, to)
            };
            cursor.add(1, 'day');
            return day;
        });
    }

    openMonthPicker(): void {
        if (this.isDisabled) return;
        this.state = 'month';
        const view = (this.date ?? moment()).clone().locale(this.calendarLocale).startOf('year');
        this.months = Array.from({ length: 12 }, (_, i) => {
            const month = view.clone().add(i, 'month');
            return { value: month.month(), name: month.format('MMMM'), isSelected: month.month() === this.month?.value };
        });
    }

    openYearPicker(): void {
        if (this.isDisabled) return;
        this.state = 'year';
        this.years = Array.from({ length: 200 }, (_, i) => ({ value: this.year - 100 + i, isSelected: i === 100 }));
        clearTimeout(this.yearScrollTimer);
        this.yearScrollTimer = setTimeout(() => {
            this.yearPicker?.nativeElement.querySelector<HTMLElement>('[aria-pressed="true"]')?.scrollIntoView({ block: 'center' });
        });
    }

    selectYear(year: number): void {
        if (this.isDisabled) return;
        this.date = (this.date ?? moment()).clone().locale(this.calendarLocale).date(1).year(year);
        this.createDays();
        this.openMonthPicker();
    }

    selectMonth(month: number): void {
        if (this.isDisabled) return;
        this.date = (this.date ?? moment()).clone().locale(this.calendarLocale).date(1).month(month);
        this.state = 'date';
        this.createDays();
    }

    goToday(): void {
        if (this.isDisabled) return;
        this.date = moment().locale(this.calendarLocale);
        this.state = 'date';
        this.createDays();
    }

    selectDate(day: CalendarDay): void {
        if (this.isDisabled || day.isDisabled) return;
        const existing = this.nextEndpoint === 'from' ? this.fromDate : this.toDate;
        let selected = moment(day.value).locale(this.calendarLocale).set({
            hour: this.showTimePicker ? existing?.hour() ?? 0 : 0,
            minute: this.showTimePicker ? existing?.minute() ?? 0 : 0,
            second: this.showTimePicker ? existing?.second() ?? 0 : 0,
            millisecond: 0
        });
        // Boundary days remain selectable even when only part of the day is allowed.
        const { min, max } = this.bounds();
        if (min && selected.valueOf() < min.valueOf()) selected = min.clone().locale(this.calendarLocale);
        if (max && selected.valueOf() > max.valueOf()) selected = max.clone().locale(this.calendarLocale);
        if (!this.isWithinBounds(selected)) return;
        if (this.nextEndpoint === 'from') {
            this.fromDate = selected;
            this.toDate = undefined;
            this.activeEndpoint = 'from';
            this.nextEndpoint = 'to';
        } else {
            this.toDate = selected;
            this.activeEndpoint = 'to';
            this.nextEndpoint = 'from';
        }
        this.date = selected.clone();
        this.createDays();
        this.emitValue(true);
        // Keep this single calendar open: a third click starts a new range.
    }

    editEndpoint(endpoint: Endpoint): void {
        if (this.isDisabled) return;
        this.activeEndpoint = endpoint;
        const date = endpoint === 'from' ? this.fromDate : this.toDate;
        if (date) { this.date = date.clone(); this.createDays(); }
    }

    adjustTime(unit: TimeUnit, amount: number): void {
        if (this.isDisabled || !this.showTimePicker || !this.activeDate) return;
        const changed = this.activeDate.clone().add(amount, unit);
        if (!this.isWithinBounds(changed)) return;
        if (this.activeEndpoint === 'from') this.fromDate = changed;
        else this.toDate = changed;
        this.date = changed.clone();
        this.createDays();
        this.emitValue(true);
    }

    private emitValue(selected: boolean, syncDisplay = true): void {
        this.value = this.fromDate || this.toDate ? { from: this.formatValue(this.fromDate), to: this.formatValue(this.toDate) } : null;
        if (syncDisplay) this.updateDisplay();
        this.onChange?.(this.value ? { ...this.value } : null);
        if (selected) {
            this.onTouched?.();
            this.onSelect.emit(this.value ? { ...this.value } : null);
        }
    }

    override ngOnDestroy(): void {
        clearTimeout(this.yearScrollTimer);
        super.ngOnDestroy();
    }
}
