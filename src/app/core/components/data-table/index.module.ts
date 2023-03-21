import {NgModule} from "@angular/core";
import {DataTableComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {DevTemplateModule} from "../../directives/template/dev-template.directive";
import {DataTableSortDirective} from "./directives/sort.directive";
import {SelectModule} from "../form/select/select.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableRowExpanderComponent} from "./components/row-expander/row-expander.component";
import {DataTableFilterComponent} from "./components/filter/filter.component";
import {OverlayService} from "../overlay/overlay.service";
import { PaginatorModule } from "../paginator/paginator.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    DevTemplateModule,
    SelectModule,
    PaginatorModule,
  ],
  declarations: [
    DataTableComponent,
    DataTableRowExpanderComponent,
    DataTableFilterComponent,
    DataTableSortDirective,
  ],
  exports: [
    DataTableComponent,
    DataTableRowExpanderComponent,
    DataTableFilterComponent,
    DataTableSortDirective,

    DevTemplateModule,
  ],
  providers: [
    OverlayService
  ]
})
export class DataTableModule {}
