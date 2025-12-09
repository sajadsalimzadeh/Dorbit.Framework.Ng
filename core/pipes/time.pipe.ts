import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'time',
    standalone: true
})
export class TimePipe implements PipeTransform {
    transform(value: number, format: 'mm:ss' | 'ss' | string = 'mm:ss', unit: 'ms' | 'sec' | 'min' | 'hour' = 'sec'): string {
        if (unit === 'ms') {
            value /= 1000;
        } else if (unit === 'min') {
            value *= 60;
        } else if (unit === 'hour') {
            value *= 60 * 60;
        }

        const seconds = Math.floor(value % 60);
        const minutes = Math.floor((value / 60) % 60);
        const hours = Math.floor(value / 3600);

        const totalSeconds = Math.floor(value % 60);
        const totalMinutes = Math.floor((value / 60) % 60);
        const totalHours = Math.floor(value / 3600);

        return format
            .replace('ts', totalSeconds.toString().padStart(2, '0'))
            .replace('tm', totalMinutes.toString().padStart(2, '0'))
            .replace('th', totalHours.toString().padStart(2, '0'))
            .replace('ss', seconds.toString().padStart(2, '0'))
            .replace('mm', minutes.toString().padStart(2, '0'))
            .replace('hh', hours.toString().padStart(2, '0'))
    }
}