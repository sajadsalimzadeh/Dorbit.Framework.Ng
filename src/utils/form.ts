import {FormGroup} from "@angular/forms";

export class FormUtil {
    static getErrors(form: FormGroup) {
        const errors: any = {};
        Object.keys(form.controls).forEach(controlKey => {
            const control = form.controls[controlKey];
            control.markAsDirty();
            control.markAsTouched();
            if (control.errors) {
                Object.keys(control.errors).forEach(errorKey => {
                    if (control.errors) {
                        errors[controlKey] ??= {};
                        errors[controlKey][errorKey] = control.errors[errorKey];
                    }
                });
            }
        });
        return errors;
    }

    static isValid(form: FormGroup) {
        return Object.keys(this.getErrors(form)).length == 0;
    }

    static markAsDirty(form: FormGroup) {
        Object.keys(form.controls).forEach(key => {
            const control = form.controls[key];
            control.markAsDirty();
        });
    }
}
