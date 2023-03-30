import {NgModule} from '@angular/core';

import {ProgressBarComponent} from './progress-bar.component';
import {CommonModule} from "@angular/common";

export * from './progress-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ProgressBarComponent],
  exports: [ProgressBarComponent],
  providers: [],
})
export class ProgressBarModule {
}
