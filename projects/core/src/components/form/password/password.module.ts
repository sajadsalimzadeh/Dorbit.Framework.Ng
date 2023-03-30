import {NgModule} from '@angular/core';

import {PasswordComponent} from './password.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DevTemplateModule} from "../../../directives";

export * from './password.component';

@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PasswordComponent],
  exports: [PasswordComponent, DevTemplateModule],
  providers: [],
})
export class PasswordModule {
}
