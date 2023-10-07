import {ModuleWithProviders, NgModule} from '@angular/core';

import {ControlGroupComponent} from './control-group.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TemplateModule} from "../../template/template.directive";
import {OverlayModule} from "../../overlay/overlay.module";

export * from './control-group-validation.service';
export * from './control-group.component';

@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,

    OverlayModule,
  ],
  declarations: [ControlGroupComponent],
  exports: [ControlGroupComponent, TemplateModule],
  providers: [],
})
export class ControlGroupModule {
  static forRoot(): ModuleWithProviders<ControlGroupModule> {
    return {
      ngModule: ControlGroupModule,
      providers: []
    }
  }
}
