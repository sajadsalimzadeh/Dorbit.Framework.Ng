import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DatePickerComponent} from "./date-picker.component";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

export * from './date-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent]
})
export class DatePickerModule {
}
