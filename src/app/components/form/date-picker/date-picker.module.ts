import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DatePickerComponent} from "./date-picker.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent]
})
export class DatePickerModule {}
