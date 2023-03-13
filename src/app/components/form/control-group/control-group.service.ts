import {Injectable} from "@angular/core";


@Injectable({providedIn: 'root'})
export class ControlGroupService {
  validationMessages: any = {
    required: 'this item is required',
    pattern: 'required pattern is {requiredPattern}',
    minlength: 'min length is {requiredLength}',
    maxlength: 'max length {requiredLength}',
    min: 'min value is {min}',
    max: 'max value {max}',
    email: 'excepted email format',
  }
}
