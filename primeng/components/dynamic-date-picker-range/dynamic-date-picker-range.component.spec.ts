import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import moment from 'jalali-moment';
import { DynamicDatePickerRangeComponent, DynamicDatePickerRangeValue } from './dynamic-date-picker-range.component';

@Component({
    standalone: true,
    imports: [DynamicDatePickerRangeComponent, ReactiveFormsModule],
    template: `<p-dynamic-date-picker-range [formControl]="control" locale="en" [showClear]="true" label="Range" />`
})
class RangeFormHost {
    control = new FormControl<DynamicDatePickerRangeValue | null>(null);
}

describe('DynamicDatePickerRangeComponent', () => {
    let fixture: ComponentFixture<DynamicDatePickerRangeComponent>;
    let component: DynamicDatePickerRangeComponent;
    let changed: jasmine.Spy;
    let touched: jasmine.Spy;

    function day(value: string) {
        component.date = moment.from(value, 'en', 'YYYY-MM-DD').locale(component.calendarLocale);
        component.createDays();
        const timestamp = moment.from(value, 'en', 'YYYY-MM-DD').startOf('day').valueOf();
        return component.dates.find(item => item.value === timestamp)!;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DynamicDatePickerRangeComponent, RangeFormHost],
            providers: [{ provide: TranslateService, useValue: { instant: () => 'fa' } }]
        }).compileComponents();
        fixture = TestBed.createComponent(DynamicDatePickerRangeComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('locale', 'en');
        fixture.detectChanges();
        changed = jasmine.createSpy('changed');
        touched = jasmine.createSpy('touched');
        component.registerOnChange(changed);
        component.registerOnTouched(touched);
    });

    afterEach(() => fixture.destroy());

    it('cycles start, end, new start, new end in one calendar without hiding it', () => {
        const hidden = spyOn(component.popover, 'hide');
        component.selectDate(day('2026-11-10'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-10', to: null });
        expect(component.nextEndpoint).toBe('to');
        component.selectDate(day('2026-11-15'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-10', to: '2026-11-15' });
        expect(component.dates.filter(item => item.isInRange).length).toBe(4);
        component.selectDate(day('2026-11-20'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-20', to: null });
        component.selectDate(day('2026-11-25'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-20', to: '2026-11-25' });
        expect(hidden).not.toHaveBeenCalled();
        expect(touched).toHaveBeenCalled();
    });

    it('preserves click order and supports same-day ranges', () => {
        component.selectDate(day('2026-11-20'));
        component.selectDate(day('2026-11-10'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-20', to: '2026-11-10' });
        component.selectDate(day('2026-11-25'));
        component.selectDate(day('2026-11-25'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-25', to: '2026-11-25' });
    });

    it('writes and resets the model without emitting or mutating the supplied object', () => {
        const value = { from: '2026-11-10', to: '2026-11-15' };
        component.writeValue(value);
        expect(component.displayValue).toBe('2026/11/10 — 2026/11/15');
        expect(changed).not.toHaveBeenCalled();
        component.selectDate(day('2026-11-20'));
        expect(value).toEqual({ from: '2026-11-10', to: '2026-11-15' });
        component.writeValue(null);
        expect(component.displayValue).toBe('');
        expect(component.dates.some(item => item.isSelected)).toBeFalse();
        expect(component.nextEndpoint).toBe('from');
    });

    it('continues a partial externally supplied range with an end date', () => {
        component.writeValue({ from: '2026-11-10', to: null });
        component.selectDate(day('2026-11-12'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-10', to: '2026-11-12' });
    });

    it('clears selection, display and click cycle together', () => {
        component.writeValue({ from: '2026-11-10', to: '2026-11-15' });
        const selected = spyOn(component.onSelect, 'emit');
        component.clear();
        expect(changed).toHaveBeenCalledOnceWith(null);
        expect(selected).toHaveBeenCalledOnceWith(null);
        expect(component.displayValue).toBe('');
        component.selectDate(day('2026-12-01'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-12-01', to: null });
    });

    it('converts Jalali display dates to Gregorian values and normalizes Persian/Arabic digits', () => {
        component.locale = 'fa';
        component.displayFormat = 'jYYYY/jMM/jDD';
        component.displayValue = '۱۴۰۵/۰۸/۲۹ — ١٤٠٥/٠٨/٣٠';
        component.updateValueFromDisplay();
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-20', to: '2026-11-21' });
        component.onBlur();
        expect(component.displayValue).toBe('1405/08/29 — 1405/08/30');
        component.createDays();
        expect(component.dates[0].value).toBe(moment(component.dates[0].value).day(6).valueOf());
    });

    it('rejects invalid typed dates and extra endpoints without emitting onSelect', () => {
        const selected = spyOn(component.onSelect, 'emit');
        for (const display of ['2026/02/30 — 2026/03/02', '2026/11/10 — invalid', '2026/11/10 — 2026/11/11 — 2026/11/12']) {
            component.displayValue = display;
            component.updateValueFromDisplay();
            expect(changed.calls.mostRecent().args[0]).toBeNull();
            expect(component.displayValue).toBe(display);
        }
        expect(selected).not.toHaveBeenCalled();
    });

    it('applies inclusive min/max to both selected and typed endpoints', () => {
        component.min = '2026-11-10';
        component.max = '2026-11-15';
        component.selectDate(day('2026-11-09'));
        component.selectDate(day('2026-11-16'));
        expect(changed).not.toHaveBeenCalled();
        component.selectDate(day('2026-11-10'));
        component.selectDate(day('2026-11-15'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-10', to: '2026-11-15' });
        component.displayValue = '2026/11/10 — 2026/11/16';
        component.updateValueFromDisplay();
        expect(changed.calls.mostRecent().args[0]).toBeNull();
    });

    it('preserves independent endpoint times and does not advance the selection cycle when time changes', () => {
        component.showTimePicker = true;
        component.writeValue({ from: '2026-11-10T08:30:15', to: '2026-11-15T17:45:20' });
        component.editEndpoint('from');
        component.adjustTime('hour', 1);
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-10T09:30:15', to: '2026-11-15T17:45:20' });
        expect(component.nextEndpoint).toBe('from');
        component.editEndpoint('to');
        component.adjustTime('minute', -1);
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-10T09:30:15', to: '2026-11-15T17:44:20' });
    });

    it('allows partial boundary days in time mode and blocks time changes beyond the bounds', () => {
        component.showTimePicker = true;
        component.min = '2026-11-10T10:00:00';
        component.max = '2026-11-10T16:00:00';
        component.selectDate(day('2026-11-10'));
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-10T10:00:00', to: null });
        changed.calls.reset();
        component.adjustTime('second', -1);
        expect(changed).not.toHaveBeenCalled();
        component.adjustTime('hour', 6);
        expect(changed).toHaveBeenCalledWith({ from: '2026-11-10T16:00:00', to: null });
        changed.calls.reset();
        component.adjustTime('second', 1);
        expect(changed).not.toHaveBeenCalled();
    });

    it('browses year/month and today without emitting or altering an existing range', () => {
        component.writeValue({ from: '2026-01-31', to: '2026-02-28' });
        component.selectYear(2027);
        expect(component.months.length).toBe(12);
        component.selectMonth(1);
        expect(component.year).toBe(2027);
        expect(component.month?.value).toBe(1);
        component.goToday();
        expect(component.fromText).toBe('2026/01/31');
        expect(component.toText).toBe('2026/02/28');
        expect(changed).not.toHaveBeenCalled();
    });

    it('does not mutate selections or open the calendar while disabled', () => {
        component.writeValue({ from: '2026-11-10', to: null });
        component.setDisabledState(true);
        const shown = spyOn(component.popover, 'show');
        component.open(new Event('focus'));
        component.selectDate(day('2026-11-12'));
        component.clear();
        expect(shown).not.toHaveBeenCalled();
        expect(changed).not.toHaveBeenCalled();
        expect(component.fromText).toBe('2026/11/10');
    });

    it('uses one input and integrates with FormControl disabled, touched and reset states', fakeAsync(() => {
        const host = TestBed.createComponent(RangeFormHost);
        host.detectChanges(); tick(); host.detectChanges();
        expect(host.nativeElement.querySelectorAll('input').length).toBe(1);
        const input = host.nativeElement.querySelector('input') as HTMLInputElement;
        host.componentInstance.control.setValue({ from: '2026-11-10', to: '2026-11-15' });
        host.detectChanges(); tick();
        expect(input.value).toBe('2026/11/10 — 2026/11/15');
        input.dispatchEvent(new Event('blur'));
        expect(host.componentInstance.control.touched).toBeTrue();
        host.componentInstance.control.disable();
        host.detectChanges(); tick();
        expect(input.disabled).toBeTrue();
        host.componentInstance.control.enable();
        host.componentInstance.control.reset();
        host.detectChanges(); tick();
        expect(input.value).toBe('');
        expect(input.disabled).toBeFalse();
        host.destroy();
    }));

    it('displays external ISO timestamps from report shortcuts and updates again without changing the model', fakeAsync(() => {
        const host = TestBed.createComponent(RangeFormHost);
        host.detectChanges(); tick(); host.detectChanges();
        const input = host.nativeElement.querySelector('input') as HTMLInputElement;
        const emitted = jasmine.createSpy('valueChanges');
        const values = host.componentInstance.control.valueChanges.subscribe(emitted);
        const first = { from: '2026-11-10T00:00:00', to: '2026-11-20T23:59:59' };
        host.componentInstance.control.setValue(first);
        host.detectChanges(); tick(); host.detectChanges();
        expect(input.value).toBe('2026/11/10 — 2026/11/20');
        expect(host.componentInstance.control.value).toEqual(first);
        expect(emitted).toHaveBeenCalledTimes(1);
        const second = { from: '2026-10-01T00:00:00', to: '2026-10-31T23:59:59' };
        host.componentInstance.control.patchValue(second);
        host.detectChanges(); tick(); host.detectChanges();
        expect(input.value).toBe('2026/10/01 — 2026/10/31');
        expect(host.componentInstance.control.value).toEqual(second);
        expect(emitted).toHaveBeenCalledTimes(2);
        host.componentInstance.control.reset();
        host.detectChanges(); tick(); host.detectChanges();
        expect(input.value).toBe('');
        values.unsubscribe();
        host.destroy();
    }));

    it('renders externally supplied ISO times as Jalali dates without emitting or discarding the model times', () => {
        component.locale = 'fa';
        component.displayFormat = 'jYYYY/jMM/jDD';
        const model = { from: '2026-11-20T00:00:00', to: '2026-11-21T23:59:59.000' };
        component.writeValue(model);
        expect(component.displayValue).toBe('1405/08/29 — 1405/08/30');
        expect(component.dates.filter(item => item.isSelected).length).toBe(2);
        expect(changed).not.toHaveBeenCalled();
        expect(model.to).toBe('2026-11-21T23:59:59.000');
    });

    it('rejects invalid ISO model dates and applies ISO bounds to date-only selection', () => {
        component.writeValue({ from: '2026-02-30T00:00:00', to: 'not-a-date' });
        expect(component.displayValue).toBe('');
        component.min = '2026-11-10T00:00:00';
        component.max = '2026-11-15T23:59:59';
        expect(day('2026-11-09').isDisabled).toBeTrue();
        expect(day('2026-11-10').isDisabled).toBeFalse();
        expect(day('2026-11-15').isDisabled).toBeFalse();
        expect(day('2026-11-16').isDisabled).toBeTrue();
    });

    it('renders and operates a single calendar with keyboard-operable day buttons', fakeAsync(() => {
        component.open(new Event('click'));
        fixture.detectChanges(); tick(500); fixture.detectChanges();
        expect(document.querySelectorAll('.date-picker-range-container').length).toBe(1);
        const cells = Array.from(document.querySelectorAll<HTMLButtonElement>('.date-picker-range-container .day'));
        expect(cells.length).toBeGreaterThanOrEqual(28);
        const first = cells.find(cell => !cell.disabled)!;
        first.click(); fixture.detectChanges();
        expect(changed.calls.mostRecent().args[0].to).toBeNull();
        const next = document.querySelector<HTMLButtonElement>('.date-picker-range-container .day:not(:disabled)')!;
        next.click(); fixture.detectChanges();
        expect(changed.calls.mostRecent().args[0].to).not.toBeNull();
        component.popover.hide(); fixture.detectChanges(); tick(500);
    }));

    it('cancels its instance-local year scroll callback when destroyed', fakeAsync(() => {
        component.openYearPicker();
        fixture.destroy();
        tick();
        expect(changed).not.toHaveBeenCalled();
    }));

    it('updates filled endpoint colors and clears the previous range when starting over', fakeAsync(() => {
        component.open(new Event('click'));
        fixture.detectChanges(); tick(500); fixture.detectChanges();
        const labels = component.dates.filter(item => item.isCurrentMonth && !item.isDisabled).slice(0, 3).map(item => item.label);
        const cell = (label: string) => document.querySelector<HTMLButtonElement>(`.date-picker-range-container button.day[aria-label="${label}"]`)!;
        cell(labels[0]).click(); fixture.detectChanges();
        expect(cell(labels[0]).classList.contains('p-button-info')).toBeTrue();
        expect(cell(labels[0]).classList.contains('p-button-text')).toBeFalse();
        cell(labels[1]).click(); fixture.detectChanges();
        expect(cell(labels[1]).classList.contains('p-button-success')).toBeTrue();
        expect(cell(labels[1]).classList.contains('p-button-text')).toBeFalse();
        expect(cell(labels[0]).getAttribute('aria-pressed')).toBe('true');
        cell(labels[2]).click(); fixture.detectChanges();
        expect(cell(labels[0]).classList.contains('p-button-text')).toBeTrue();
        expect(cell(labels[2]).classList.contains('p-button-info')).toBeTrue();
        expect(document.querySelector('.date-picker-range-container .selection-hint')).toBeNull();
        expect(document.querySelectorAll('.range-summary .range-endpoint').length).toBe(2);
        component.popover.hide(); fixture.detectChanges(); tick(500);
    }));
});
