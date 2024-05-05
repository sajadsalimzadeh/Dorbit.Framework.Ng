import {AbstractControl, ValidatorFn} from "@angular/forms";


export function NationalValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let nt = control.value;
    if (nt == null || nt == undefined || nt == '') {
      return {'national-code': {value: control.value}};
    }
    if (nt.length !== 10) {
      return {'national-code': {value: control.value}};
    }
    let sum = 0;
    for (let i = 0; i < 10 - 1; i++) {
      sum += (+nt[i]) * (10 - i);
    }
    let ll = +nt[9];
    let x = sum % 11;
    if (x === 0 && ll === 0) {
      return null;
    }
    if (x === 1 && ll === 1) {
      return null;
    }
    if (x > 1 && x == (11 - ll)) {
      return null;
    }
    return {'national-code': {value: control.value}};
  };
}
