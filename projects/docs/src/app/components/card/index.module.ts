import {NgModule} from "@angular/core";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {DorbitModule} from "@core";


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    DorbitModule,
  ],
  declarations: [IndexComponent],
  exports: [IndexComponent]
})
export class DocCardModule {}
