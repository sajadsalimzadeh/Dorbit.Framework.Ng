import { Component, HostBinding, Input } from '@angular/core';
import { Severity } from '../../contracts/severity';
import { PrimengComponent } from '../primeng.component';

@Component({
    standalone: false,
    selector: 'p-custom-alert',
    styleUrl: 'custom-alert.component.scss',
    templateUrl: 'custom-alert.component.html'
})
export class CustomAlertComponent extends PrimengComponent {
    @Input() @HostBinding('class') severity: Severity = 'primary';
}
