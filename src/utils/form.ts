import {FormGroup} from "@angular/forms";

export class FormUtil {
    static getErrors(form?: FormGroup) {
        const errors: any = {};
        if (form) {
            Object.keys(form.controls).forEach(key => {
                const control = form.controls[key];
                if (control.errors) {
                    Object.keys(control.errors).forEach(eKey => {
                        if (control.errors) errors[eKey] = control.errors[eKey];
                    });
                }
            });
        }
        return errors;
    }

    static isValid(form?: FormGroup) {
        return Object.keys(this.getErrors(form)).length == 0;
    }
}
