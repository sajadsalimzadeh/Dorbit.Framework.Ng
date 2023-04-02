import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePickerInlineComponent} from "./date-picker-inline.component";
import {ControlGroupModule} from "../control-group/control-group.module";
import {SelectModule} from "../select/select.module";

export * from './date-picker-inline.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    ControlGroupModule,
  ],
  declarations: [DatePickerInlineComponent],
  exports: [DatePickerInlineComponent]
})
export class DatePickerInlineModule {}
