import { PrimengComponent } from './primeng.component';
import { Directive, EventEmitter, Injector, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ISaveRepository } from '@framework/repositories/base-crud.repository';
import { FormUtil } from '@framework/utils/form';

@Directive()
export abstract class PrimengFormComponent<T extends {id?: string} = any> extends PrimengComponent {
    @Input() model?: T;

    @Output() onComplete = new EventEmitter();

    abstract form: FormGroup<any>;

    constructor(injector: Injector, protected repository: ISaveRepository) {
        super(injector);
    }

    override ngOnInit() {
        super.ngOnInit();

        if (this.model) {
            this.form.patchValue({ ...this.model });
        }
    }

    getFormValue() {
        return this.form.getRawValue();
    }

    submit() {
        if (!FormUtil.isValid(this.form)) return;
        const req = {
            id: this.model?.id,
            ...this.getFormValue(),
        }
        this.repository.save(req).subscribe(res => {
            this.onComplete.emit();
        })
    }
}
