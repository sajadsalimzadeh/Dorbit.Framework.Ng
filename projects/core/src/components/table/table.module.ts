import {NgModule} from "@angular/core";
import {TableComponent} from "./table.component";
import {CommonModule} from "@angular/common";
import {TemplateModule} from "../template/template.directive";
import {TableSortDirective} from "./directives/sort.directive";
import {SelectModule} from "../form/select/select.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableRowExpanderComponent} from "./components/row-expander/row-expander.component";
import {TableFilterComponent} from "./components/filter/filter.component";
import {OverlayService} from "../overlay/overlay.service";
import {PaginatorModule} from "../paginator/paginator.module";
import {TableTemplateDirective} from "./directives/table-template.directive";

export * from './models';
export * from './table.component';
export * from './directives/sort.directive';
export * from './components/filter/filter.component';
export * from './components/row-expander/row-expander.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TemplateModule,
    SelectModule,
    PaginatorModule,
  ],
  declarations: [
    TableComponent,
    TableTemplateDirective,
    TableRowExpanderComponent,
    TableFilterComponent,
    TableSortDirective,
  ],
  exports: [
    TableComponent,
    TableTemplateDirective,
    TableRowExpanderComponent,
    TableFilterComponent,
    TableSortDirective,

    TemplateModule,
  ],
  providers: [
    OverlayService
  ]
})
export class TableModule {
}
