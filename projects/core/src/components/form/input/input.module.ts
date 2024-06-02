import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {InputComponent} from './input.component';
import {TemplateModule} from "../../template/template.directive";
import {KeyFilterModule} from "../../key-filter/key-filter.directive";

export * from './input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KeyFilterModule
  ],
  declarations: [InputComponent],
  exports: [CommonModule, CommonModule, InputComponent, TemplateModule],
  providers: [],
})
export class InputModule {
}
