import {Pipe, PipeTransform} from "@angular/core";
import moment from "jalali-moment";

@Pipe({
    name: 'moment',
    standalone: true
})
export class MomentPipe implements PipeTransform {

    transform(value?: number | string, format: string = 'YYYY/MM/DD HH:mm:ss', locale: string = 'en'): any {
        if (!value) return null;
        if (typeof value == 'string') {
            return moment.from(value, 'en').locale(locale).format(format)
        }
        return moment.utc(value).locale(locale).format(format)
    }

}
