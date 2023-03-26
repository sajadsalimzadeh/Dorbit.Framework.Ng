export class TimeSpan {
    second: number;
    minute: number;
    hour: number;
    day: number;
    month: number;
    year: number;

    constructor(second?: number, minute?: number, hour?: number, day?: number, month?: number, year?: number) {
        this.second = second || 0;
        this.minute = minute || 0;
        this.hour = hour || 0;
        this.day = day || 0;
        this.month = month || 0;
        this.year = year || 0;
    }

    static fromSecond(value: number): TimeSpan { return new TimeSpan(value); }
    static fromMinute(value: number): TimeSpan { return new TimeSpan(0, value); }
    static fromHour(value: number): TimeSpan { return new TimeSpan(0, 0, value); }
    static fromDay(value: number): TimeSpan { return new TimeSpan(0, 0, 0, value); }
    static fromMonth(value: number): TimeSpan { return new TimeSpan(0, 0, 0, 0, value); }
    static fromYear(value: number): TimeSpan { return new TimeSpan(0, 0, 0, 0, 0, value); }

    toSeconds(): number {
        return ((((this.day * 24) + this.hour) * 60) + this.minute) * 60 + this.second;
    }
}