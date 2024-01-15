import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectComponent} from "./select.component";
import {CheckboxModule} from "../checkbox/checkbox.module";
import {InputModule} from "../input/input.module";

export * from './select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CheckboxModule,
    InputModule
  ],
  declarations: [
    SelectComponent,
  ],
  exports: [
    SelectComponent,
  ]
})
export class SelectModule {
}
