import {PrimengComponent} from '@primeng';
import {Directive, EventEmitter, Injector, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ISaveRepository} from '@framework';

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

        if(this.model) {
            this.form.reset({...this.model});
        }
    }

    submit() {
        this.repository.save(this.model?.id, this.form.getRawValue()).subscribe(res => {
            this.onComplete.emit();
        })
    }
}
