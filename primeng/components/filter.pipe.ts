import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform(value: any[], filter: string, field: string): any[] {
        if (!filter) return value;
        if (field.includes('.')) {
            const fields = field.split('.');
            if(fields.length == 3) {
                return value.filter(item => item[fields[0]][fields[1]][fields[2]] && item[fields[0]][fields[1]][fields[2]].toLowerCase().includes(filter.toLowerCase()));
            }
            if(fields.length == 4) {
                return value.filter(item => item[fields[0]][fields[1]][fields[2]][fields[3]] && item[fields[0]][fields[1]][fields[2]][fields[3]].toLowerCase().includes(filter.toLowerCase()));
            }
            return value.filter(item => item[fields[0]][fields[1]] && item[fields[0]][fields[1]].toLowerCase().includes(filter.toLowerCase()));
        }
        return value.filter(item => item[field] && item[field].toLowerCase().includes(filter.toLowerCase()));
    }
}