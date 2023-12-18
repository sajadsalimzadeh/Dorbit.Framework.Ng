import {NgModule} from "@angular/core";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {DorbitModule} from "@framework";
import {CodeModule} from "../code/code.module";


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    DorbitModule,
    CodeModule,
  ],
  declarations: [IndexComponent],
  exports: [IndexComponent]
})
export class DocCardModule {}
