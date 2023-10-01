import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DatePipe} from "@dorbit";


@NgModule({
  imports: [CommonModule],
  declarations: [DatePipe],
  exports: [DatePipe],
  providers: [],
})
export class DateModule {
}
