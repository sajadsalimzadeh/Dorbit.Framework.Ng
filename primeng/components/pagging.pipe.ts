import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'pagging',
    standalone: true
})
export class PaggingPipe implements PipeTransform {
    transform(value: any[], page: number, pageSize: number): any[] {
        return value.slice(page * pageSize, (page + 1) * pageSize);
    }
}