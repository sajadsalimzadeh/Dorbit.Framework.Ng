import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {OverlayComponent} from "./overlay.component";
import {OverlayDirective} from "./overlay.directive";

@NgModule({
    imports: [
        CommonModule,
        OverlayComponent
    ],
    declarations: [OverlayDirective],
    exports: [OverlayDirective]
})
export class OverlayModule {
}
