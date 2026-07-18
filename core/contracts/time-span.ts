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
        return new TimeSpan(value);
    }

    static fromMinute(value: number): TimeSpan {
        return new TimeSpan(0, value);
    }

    static fromHour(value: number): TimeSpan {
        return new TimeSpan(0, 0, value);
    }

    static fromDay(value: number): TimeSpan {
        return new TimeSpan(0, 0, 0, value);
    }

    static fromMonth(value: number): TimeSpan {
        return new TimeSpan(0, 0, 0, 0, value);
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

    toString(): string {
        return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
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
