import {NgModule} from '@angular/core';

import {VolumeComponent} from './volume.component';
import {CommonModule} from "@angular/common";

export * from './volume.component';

@NgModule({
  imports: [CommonModule],
  declarations: [VolumeComponent],
  exports: [VolumeComponent],
  providers: [],
})
export class VolumeModule {
}
