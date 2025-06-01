import {PrimengComponent} from '@primeng';
import {Directive, EventEmitter, Injector, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ISaveRepository} from '../../src/repositories/base-crud.repository';

@Directive()
export abstract class PrimengFormComponent extends PrimengComponent {
    @Input() model?: any;

    @Output() onComplete = new EventEmitter();

    abstract form: FormGroup;

    constructor(injector: Injector, protected repository: ISaveRepository) {
        super(injector);
    }

    override ngOnInit() {
        super.ngOnInit();

        if (this.model) {
            this.form.reset({...this.model});
        }
    }

    getFormValue() {
        return this.form.getRawValue();
    }

    submit() {
        const value = this.getFormValue();
        this.repository.save(this.model?.id, value).subscribe(res => {
            this.onComplete.emit();
        })
    }
}
