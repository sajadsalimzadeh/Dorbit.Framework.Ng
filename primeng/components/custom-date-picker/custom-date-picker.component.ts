import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PrimengControlComponent } from '../primeng-control.component';
import moment from 'jalali-moment';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'p-custom-date-picker',
    styleUrl: 'custom-date-picker.component.scss',
    templateUrl: 'custom-date-picker.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomDatePickerComponent),
        multi: true
    }]
})
export class CustomDatePickerComponent extends PrimengControlComponent implements OnChanges {
    @Input() dateFormat: string = 'YYYY/MM/DD';
    @Input() valueFormat: string = 'YYYY-MM-DD';
    @Input() showTime: boolean = false;
    @Input() hideOnDateTimeSelect: boolean = true;
    @Input() stepMinute: number = 1;

    protected innerValue: Date = new Date();
    protected innerDisplayFormat: string = '';

    override ngOnInit(): void {
        this.innerDisplayFormat = this.dateFormat.replace('YYYY', 'yy').replace('MM', 'mm').replace('DD', 'dd');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['displayFormat']) {
            this.innerDisplayFormat = this.dateFormat.replace('YYYY', 'yy').replace('MM', 'mm').replace('DD', 'dd');
        }
    }

    override writeValue(value: any): void {
        if (value) {
            this.innerValue = moment.from(value, this.valueFormat).toDate();
        } else {
            this.innerValue = new Date();
        }
    }

    setValue(value: Date) {
        console.log(value);
        
        this.value = value;
        this.onChange(moment(value).format(this.valueFormat));
    }
}
