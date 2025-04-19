import {NgModule, Pipe} from "@angular/core";
// @ts-ignore
import moment from "jalali-moment";


@Pipe({
    name: 'jdate',
    standalone: true
})
export class JDatePipe {
  transform(value: string, format: string = 'YYYY/MM/DD HH:mm:ss', utc: boolean = false): string {
    if (!value) return value;
    try {
      return (utc ? moment.utc(value).local() : moment(value)).locale('fa').local().format(format);
    } catch {
      return '';
    }
  }
}
