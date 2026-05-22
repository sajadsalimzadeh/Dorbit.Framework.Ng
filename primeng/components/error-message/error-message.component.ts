import { Component, Input } from '@angular/core';
import { PrimengComponent } from '../primeng.component';
import { FormControl } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'p-error-message',
    styleUrl: 'error-message.component.scss',
    templateUrl: 'error-message.component.html'
})
export class ErrorMessageComponent extends PrimengComponent {
    @Input() control?: FormControl;

    get errors() {
        return Object.keys(this.control?.errors ?? {});
    }
}
