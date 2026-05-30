import { Component, computed, ContentChild, ContentChildren, ElementRef, forwardRef, HostBinding, HostListener, Input, Output, QueryList, signal, TemplateRef } from '@angular/core';
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
    @Input() options: any[] = [];
    @Input() optionLabel?: string;
    @Input() optionValue?: string;
    @Input() filter: boolean = false;
    @Input() showClear: boolean = false;
    @Input() display: 'list' | 'grid' = 'list';
    @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

    @Input() gridColumns: number = 4;

    @HostListener('click') onClick() {
        this.isShowDialog.set(true);
    }

    @ContentChildren(TemplateRef) set templates(templates: QueryList<TemplateRef<any>>) { 
     templates.forEach((template:any) => {
        const localNames = template?._declarationTContainer?.localNames ?? [];
        if (localNames.includes('selectedItem')) {
            this.selectedItemTpl = template;
        }
        if (localNames.includes('item')) {
            this.itemTpl = template;
        }
     });
    }

    selectedItemTpl?: TemplateRef<any>;
    itemTpl?: TemplateRef<any>;

    protected isShowDialog = signal(false);
    protected filterValue = signal('');

    optionsFiltered = computed(() => {
        if (this.filter) {
            return this.options.filter(option => (this.optionLabel ? option[this.optionLabel] : option)?.toLowerCase().includes(this.filterValue().toLowerCase())).slice(0, 100);
        }
        return this.options;
    });

    override ngOnInit() {
        super.ngOnInit();

        this.filterValue.set('');
    }

    select(item: any) {
        this.value = (item ? (this.optionValue ? item[this.optionValue] : item) : null);
        this.onChange(this.value);
        this.isShowDialog.update(value => !value);
    }
}
