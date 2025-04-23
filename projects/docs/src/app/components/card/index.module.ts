import {NgModule} from "@angular/core";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {DorbitModule} from "@framework";
import {CodeModule} from "../code/code.module";


@NgModule({
    imports: [
        CommonModule,
        DorbitModule,
        CodeModule,
    ],
    declarations: [IndexComponent],
    exports: [IndexComponent]
})
export class DocCardModule {
}
