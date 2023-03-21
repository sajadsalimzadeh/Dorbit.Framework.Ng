import {NgModule} from '@angular/core';

import {InputComponent} from './input.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DevTemplateModule} from "../../../directives/template/dev-template.directive";

@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [InputComponent],
  exports: [InputComponent, DevTemplateModule],
  providers: [],
})
export class InputModule {
}
