import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DatePipe} from "./date.pipe";


@NgModule({
  imports: [CommonModule],
  declarations: [DatePipe],
  exports: [DatePipe],
  providers: [],
})
export class DateModule {
}
