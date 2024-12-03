import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectComponent} from "./select.component";
import {CheckboxModule} from "../checkbox/checkbox.module";
import {TranslateModule} from "@ngx-translate/core";

export * from './select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,

    CheckboxModule,
  ],
  declarations: [
    SelectComponent
  ],
  exports: [
    SelectComponent
  ]
})
export class SelectModule {
}
