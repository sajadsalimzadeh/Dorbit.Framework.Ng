import {Injectable} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Sizes} from "../../types";

@Injectable()
export class FormControlService {
  size?: Sizes;
  formControl?: FormControl;
}
