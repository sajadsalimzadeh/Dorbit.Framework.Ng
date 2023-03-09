import {Injectable} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Sizes} from "./form-control.directive";

@Injectable()
export class FormControlService {
  size?: Sizes;
  formControl?: FormControl;
}
