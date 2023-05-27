import {NgModule} from '@angular/core';

import {PasswordComponent} from './password.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TemplateModule} from "../../template/template.directive";

export * from './password.component';

@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PasswordComponent],
  exports: [PasswordComponent, TemplateModule],
  providers: [],
})
export class PasswordModule {
}
