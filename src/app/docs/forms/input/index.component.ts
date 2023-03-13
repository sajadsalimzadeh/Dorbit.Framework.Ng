import {Component} from "@angular/core";
import {AbstractControl, FormControl, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'doc-input',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  text = 'text string';
  formControl = new FormControl('');
  items = [
    'option 1',
    'option 2',
    'option 3',
    'option 4',
    'option 5',
  ];

  formControlWithValidationRequired = new FormControl('', [Validators.required]);
  formControlWithValidationPattern = new FormControl('', [Validators.pattern(/P-[0-9]{3,}/)]);
  formControlWithValidationPassword = new FormControl('', this.passwordValidators());
  formControlWithValidationNumeric = new FormControl('', [Validators.pattern('[0-9]+')]);
  formControlWithValidationMinMaxLength = new FormControl('', [Validators.minLength(2), Validators.maxLength(10)]);
  formControlWithValidationMinMax = new FormControl('', [Validators.min(100), Validators.max(200)]);
  formControlWithValidationEmail = new FormControl('', [Validators.email]);

  passwordValidators(): ValidatorFn[] {
    return [
      (c: AbstractControl) => {
        if (typeof c.value === 'string' && !c.value.match(/.*[0-9].*[0-9].*/)) return {
          passwordNumber: {
            order: 1,
            message: 'use at least two number'
          }
        };
        return null;
      },
      (c: AbstractControl) => {
        if (typeof c.value === 'string' && !c.value.match(/.*[a-z].*[a-z].*/)) return {
          passwordLowercase: {
            order: 2,
            message: 'use at least two lowercase character',
          }
        };
        return null;
      },
      (c: AbstractControl) => {
        if (typeof c.value === 'string' && !c.value.match(/.*[A-Z].*[A-Z].*/)) return {
          passwordUppercase: {
            order: 3,
            message: 'use at least two uppercase character'
          }
        };
        return null;
      },
      (c: AbstractControl) => {
        if (typeof c.value === 'string' && !c.value.match(/.*[!@#$%^&*~;'".,\\].*[!@#$%^&*~;'".,\\].*/)) return {
          passwordSpecificCharacters: {
            order: 4,
            message: 'use at least two specific character ( !@#$%^&*~;\'".,\\ )'
          }
        };
        return null;
      }
    ]
  }
}
