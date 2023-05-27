import {NgModule} from "@angular/core";
import {OverlayComponent} from "./overlay.component";
import {CommonModule} from "@angular/common";
import {OverlayDirective} from "./overlay.directive";

export * from './overlay.component';
export * from './overlay.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [OverlayComponent, OverlayDirective],
  exports: [OverlayComponent, OverlayDirective]
})
export class OverlayModule {}
