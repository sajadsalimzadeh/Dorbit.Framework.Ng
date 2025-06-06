import {PrimengComponent} from './primeng.component';
import {Directive, EventEmitter, Injector, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ISaveRepository} from '@framework/repositories/base-crud.repository';
import {FormUtil} from '@framework/utils/form';

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
        if (!FormUtil.isValid(this.form)) {
            setTimeout(() => {
                const invalidEl = this.elementRef.nativeElement.querySelector('.ng-invalid');
                if (invalidEl) {
                    invalidEl.focus();
                }
            }, 500);
            console.log(this.form.invalid, FormUtil.getErrors(this.form))
            return this.messageService.add({
                severity: 'error',
                detail: 'message.form-is-invalid'
            })
        }
        const value = this.getFormValue();
        this.repository.save(this.model?.id, value).subscribe(res => {
            this.onComplete.emit();
        })
    }
}
