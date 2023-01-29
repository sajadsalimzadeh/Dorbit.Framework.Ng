import {NgModule} from "@angular/core";
import {OverlayComponent} from "./index.component";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [OverlayComponent],
  exports: [OverlayComponent]
})
export class OverlayModule {}
