import {NgModule} from '@angular/core';

import {StepperComponent} from './stepper.component';
import {CommonModule} from "@angular/common";
import {StepDirective} from "./components/step.directive";

export * from './stepper.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StepperComponent, StepDirective],
  exports: [StepperComponent, StepDirective],
  providers: [],
})
export class StepperModule {
}
