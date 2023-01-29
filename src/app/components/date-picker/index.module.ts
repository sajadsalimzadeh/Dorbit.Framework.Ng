import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DatePickerComponent} from "./index.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent]
})
export class DatePickerModule {}
