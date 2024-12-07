import {Pipe, PipeTransform} from "@angular/core";
import moment from "jalali-moment";

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: number | string, locale: string = 'en', format: string = 'YYYY/MM/DD HH:mm:ss'): any {
    if (typeof value == 'string') {
      return moment.from(value, 'en').locale(locale).format(format)
    }
    return moment.utc(value).locale(locale).format(format)
  }

}
