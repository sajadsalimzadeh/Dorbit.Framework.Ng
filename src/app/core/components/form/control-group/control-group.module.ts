import {ModuleWithProviders, NgModule} from '@angular/core';

import {ControlGroupComponent} from './control-group.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DevTemplateModule} from "../../../directives/template/dev-template.directive";

@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ControlGroupComponent],
  exports: [ControlGroupComponent, DevTemplateModule],
  providers: [],
})
export class ControlGroupModule {
  static forRoot(): ModuleWithProviders<ControlGroupModule> {
    return {
      ngModule: ControlGroupModule,
      providers: [
      ]
    }
  }
}
