import {NgModule} from '@angular/core';

import {InputComponent} from './input.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TemplateModule} from "../../template/template.directive";

export * from './input.component';

@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [InputComponent],
  exports: [InputComponent, TemplateModule],
  providers: [],
})
export class InputModule {
}
