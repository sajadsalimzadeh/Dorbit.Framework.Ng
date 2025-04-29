import {Pipe} from "@angular/core";


@Pipe({
    name: 'rdate',
    standalone: true
})
export class RDatePipe {
    transform(value: string): string {
        if (!value) return value;
        return value.split(' ').reverse().join(' ')
    }
}
