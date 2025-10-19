import { TimeSpan } from "../contracts";

export class TimeSpanUtil {

    static parse(value: string): TimeSpan {
        const timeSpan = new TimeSpan();

        const parse = value.split(/[.:]/);

        timeSpan.days = +parse[0];
        timeSpan.hours = +parse[1];
        timeSpan.minutes = +parse[2];
        timeSpan.seconds = +parse[3];

        return timeSpan;
    }
}
