import {NgModule, Pipe} from "@angular/core";


@Pipe({
  name: 'rdate'
})
export class RDatePipe {
  transform(value: string): string {
    if (!value) return value;
    return value.split(' ').reverse().join(' ')
  }
}

@NgModule({
  declarations: [RDatePipe],
  exports: [RDatePipe],
})
export class RDatePipeModule {

}
