import {NgModule} from "@angular/core";
import {TimelineComponent} from "./timeline.component";
import {CommonModule} from "@angular/common";


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TimelineComponent
  ],
  exports: [
    TimelineComponent
  ],
})
export class TimelineModule {}
