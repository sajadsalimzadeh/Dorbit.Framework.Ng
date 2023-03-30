import {NgModule} from "@angular/core";
import {TimelineComponent} from "./timeline.component";
import {CommonModule} from "@angular/common";
import {DevTemplateModule} from "../../directives";

export * from './timeline.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TimelineComponent
  ],
  exports: [
    TimelineComponent,

    DevTemplateModule,
  ],
})
export class TimelineModule {}
