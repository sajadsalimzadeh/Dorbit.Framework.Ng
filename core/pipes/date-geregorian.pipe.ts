import {Pipe, PipeTransform} from "@angular/core";
import moment from "jalali-moment";

@Pipe({
    name: 'gdate',
    standalone: true
})
export class DateGeregorianPipe implements PipeTransform {

    transform(value: number | string, format: string = 'yyyy/MM/DD HH:mm:ss', locale: string = 'en'): any {
        if (typeof value == 'string') {
            return moment.from(value, 'en').locale(locale).format(format)
        }
        return moment.utc(value).locale(locale).format(format)
    }

}
