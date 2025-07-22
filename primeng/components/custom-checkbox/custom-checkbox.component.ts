import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimengControlComponent } from '../primeng-control.component';
import { Severity } from '../../contracts/severity';
import { v4 as uuidv4 } from 'uuid';

@Component({
    standalone: false,
    selector: 'p-custom-checkbox',
    styleUrl: 'custom-control.component.scss',
    templateUrl: 'custom-checkbox.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomCheckboxComponent),
        multi: true
    }]
})
export class CustomCheckboxComponent extends PrimengControlComponent {
    @Input() binary: boolean = true;
    @Input() inputId: string = uuidv4();
    @Input() @HostBinding('class') severity: Severity = 'primary';
}
