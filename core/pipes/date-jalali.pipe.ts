import {Pipe} from "@angular/core";
// @ts-ignore
import moment from "jalali-moment";


@Pipe({
    name: 'jdate',
    standalone: true
})
export class DateJalaliPipe {
    transform(value?: string, format: string = 'yyyy/MM/DD HH:mm:ss', utc: boolean = true): string {
        if (!value) return '';
        try {
            return (utc ? moment.utc(value).local() : moment(value)).locale('fa').local().format(format);
        } catch {
            return '';
        }
    }
}
