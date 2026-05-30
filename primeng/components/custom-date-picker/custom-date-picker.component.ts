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
    @Input() displayFormat: string = 'YYYY/MM/DD';
    @Input() valueFormat: string = 'YYYY-MM-DD';

    protected innerValue: string = '';
    protected innerDisplayFormat: string = '';

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['displayFormat']) {
            this.innerDisplayFormat = this.displayFormat.replace('YYYY', 'yy').replace('MM', 'mm').replace('DD', 'dd');
        }
    }

    override writeValue(value: any): void {
        console.log(value);
        if(value) {
            this.innerValue = moment.from(value, this.valueFormat).format(this.displayFormat);
        } else {
        this.innerValue = '';
        }
    }

    setValue(value: Date) { 
        console.log(value);
        
        this.value = value;
        this.onChange(moment(value).format(this.valueFormat));
    }
}
