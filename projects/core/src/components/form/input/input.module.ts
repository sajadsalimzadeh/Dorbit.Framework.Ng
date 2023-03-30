import {NgModule} from '@angular/core';

import {InputComponent} from './input.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DevTemplateModule} from "../../../directives";

export * from './input.component';

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
