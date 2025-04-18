import {NgModule, Pipe} from "@angular/core";
import {NumberUtil} from "../../utils";

@Pipe({
    name: 'dNumber',
    standalone: true
})
export class NumberPipe {
  transform(value: number, precision: number = 0): string {
    if (!value || Number.isNaN(+value)) return '';
    return NumberUtil.format(+value, precision);
  }
}
