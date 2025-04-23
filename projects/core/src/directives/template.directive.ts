import {Directive, Input, TemplateRef} from "@angular/core";


@Directive({
    standalone: true,
    selector: '[dTemplate]',
})
export class TemplateDirective {

    @Input('dTemplate') name?: string = 'default';

    constructor(public template: TemplateRef<any>) {
    }

    includesName(value: string, isDefault = false) {
        if (isDefault && !this.name) return true;
        if (this.name?.includes(',')) {
            const splits = this.name.split(',');
            return splits.includes(value);
        }
        return value == this.name;
    }
}
