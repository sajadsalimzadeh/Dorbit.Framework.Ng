import {NgModule} from "@angular/core";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {CardModule} from "../../../core/components/card/card.module";


@NgModule({
  imports: [
    CommonModule,
    CardModule,
  ],
  declarations: [IndexComponent],
  exports: [IndexComponent]
})
export class DocCardModule {}
