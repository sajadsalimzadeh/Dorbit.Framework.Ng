import {NgModule} from "@angular/core";
import {SelectComponent} from "./select.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "../checkbox/checkbox.module";
import {ControlGroupModule} from "../control-group/control-group.module";
import {InputModule} from "../input/input.module";

export * from './select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CheckboxModule,
    ControlGroupModule,
    InputModule
  ],
  declarations: [
    SelectComponent,
  ],
  exports: [
    SelectComponent,
  ]
})
export class SelectModule {}
