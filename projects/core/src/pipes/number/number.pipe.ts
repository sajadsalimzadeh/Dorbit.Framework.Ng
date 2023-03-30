import { NgModule, Pipe } from "@angular/core";

@Pipe({
    name: 'dNumber'
})
export class NumberPipe {
    transform(value: number): string {
        if (!value || Number.isNaN(+value)) return '';
        return (+value).toLocaleString();
    }
}

@NgModule({
    declarations: [NumberPipe],
    exports: [NumberPipe],
})
export class NumberPipeModule {

}
