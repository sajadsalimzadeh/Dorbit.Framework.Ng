export class TimeSpan {
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    months: number;
    years: number;

    constructor(second?: number, minute?: number, hour?: number, day?: number, month?: number, year?: number) {
        this.seconds = second || 0;
        this.minutes = minute || 0;
        this.hours = hour || 0;
        this.days = day || 0;
        this.months = month || 0;
        this.years = year || 0;
    }

    static fromSecond(value: number): TimeSpan {
        return new TimeSpan(value % 60, Math.floor(value / 60) % 60, Math.floor(value / 3600) % 24, Math.floor(value / 86400) % 30);
    }

    static fromMinute(value: number): TimeSpan {
        return new TimeSpan(0, value % 60, Math.floor(value / 60) % 24, Math.floor(value / 1440) % 30);
    }

    static fromHour(value: number): TimeSpan {
        return new TimeSpan(0, 0, value % 24, Math.floor(value / 24));
    }

    static fromDay(value: number): TimeSpan {
        return new TimeSpan(0, 0, 0, value % 30, Math.floor(value / 30.5) % 12, Math.floor(value / 365));
    }

    static fromMonth(value: number): TimeSpan {
        return new TimeSpan(0, 0, 0, 0, value % 12, Math.floor(value / 12));
    }

    static fromYear(value: number): TimeSpan {
        return new TimeSpan(0, 0, 0, 0, 0, value);
    }

    static fromString(value: string): TimeSpan {
        const parts = value.split(':');
        return new TimeSpan(parseInt(parts[2]), parseInt(parts[1]), parseInt(parts[0]));
    }

    static fromNow(): TimeSpan {
        const now = new Date();
        return new TimeSpan(now.getSeconds(), now.getMinutes(), now.getHours(), now.getDate(), now.getMonth(), now.getFullYear());
    }

    toString(format: string = 'HH:mm:ss'): string {
        format = format.toLowerCase();
        format = format.replace('hh', this.hours.toString().padStart(2, '0'));
        format = format.replace('mm', this.minutes.toString().padStart(2, '0'));
        format = format.replace('ss', this.seconds.toString().padStart(2, '0'));
        return format;
    }

    timeOfDay(): TimeSpan {
        return new TimeSpan(this.seconds, this.minutes, this.hours);
    }
    
    toHours(): number {
        return ((((((this.years * 12) + this.months) * 30) + this.days) * 24) + this.hours);
    }

    toMinutes(): number {
        return (((((((this.years * 12) + this.months) * 30) + this.days) * 24) + this.hours) * 60) + this.minutes;
    }

    toSeconds(): number {
        return (((((((((this.years * 12) + this.months) * 30) + this.days) * 24) + this.hours) * 60) + this.minutes) * 60) + this.seconds;
    }
}
