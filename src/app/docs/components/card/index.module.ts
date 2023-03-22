import {NgModule} from "@angular/core";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {DevModule} from "../../../core/dev.module";


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    DevModule,
  ],
  declarations: [IndexComponent],
  exports: [IndexComponent]
})
export class DocCardModule {}
