import { Component, ContentChild, ElementRef, forwardRef, Input, TemplateRef } from '@angular/core';
import { PrimengControlComponent } from '../primeng-control.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'p-select-dialog',
    styleUrl: 'select-dialog.component.scss',
    templateUrl: 'select-dialog.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectDialogComponent),
            multi: true
        }
    ]
})
export class SelectDialogComponent extends PrimengControlComponent {
    @Input() items: any[] = [];
    @Input() optionLabel?: string;
    @Input() optionValue?: string;

    @ContentChild('selectedItem', { read: ElementRef }) selectedItemTpl?: TemplateRef<any>;
    @ContentChild('item', { read: ElementRef }) itemTpl?: TemplateRef<any>;

    protected isShowDialog = false;
}
