import { NgModule, Pipe } from "@angular/core";
import { GDate } from "../../utils";


@Pipe({
    name: 'jdate'
})
export class JDatePipe {
    transform(value: string, format?: string): string {
        if (!value) return value;
        return GDate.parse(value).toJDate().format(format)
    }
}

@NgModule({
    declarations: [JDatePipe],
    exports: [JDatePipe],
})
export class JDatePipeModule {

}
