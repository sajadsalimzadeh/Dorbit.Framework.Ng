import { Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PrimengControlComponent } from "../primeng-control.component";

@Component({
    standalone: false,
    selector: 'p-input-hex',
    templateUrl: './input-hex.component.html',
    styleUrls: ['./input-hex.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputHexComponent),
        multi: true
    }]
})
export class InputHexComponent extends PrimengControlComponent {
    @Input() size?: 'small' | 'large';

    innerValue: string = '';

    override writeValue(value: any): void {
        const hexValue = value?.toString(16).toUpperCase() ?? '';
        this.innerValue = (hexValue ? '0x' + (hexValue.length % 2 === 0 ? hexValue : '0' + hexValue) : '');
    }

    onInnerValueChange(value: string): void {
        this.onChange(parseInt(value, 16));
    }
}