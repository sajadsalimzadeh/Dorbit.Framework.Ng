import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "jalali-moment";

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: number | string, locale: string, format: string = 'YYYY/MM/DD HH:mm:ss'): any {
    if (typeof value == 'string') {
      return moment(value, 'en').locale(locale).format(format)
    }
    return moment.utc(value).locale(locale).format(format)
  }

}
