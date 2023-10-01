import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputSplitComponent} from "./input-split.component";
import {ControlGroupModule} from "../control-group/control-group.module";
import {SelectModule} from "../select/select.module";
import {InputModule} from "../input/input.module";

export * from './input-split.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SelectModule,
    InputModule,
    ControlGroupModule,
  ],
  declarations: [InputSplitComponent],
  exports: [InputSplitComponent, InputModule]
})
export class InputSplitModule {}
