import {NgModule} from "@angular/core";
import {TimelineComponent} from "./timeline.component";
import {CommonModule} from "@angular/common";
import {TemplateModule} from "../template/template.directive";

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

    TemplateModule,
  ],
})
export class TimelineModule {}
