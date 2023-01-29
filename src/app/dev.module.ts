import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableModule} from "./components/data-table/index.module";
import {SelectModule} from "./components/form/select/index.module";
import {DatePickerModule} from "./components/date-picker/index.module";
import {TemplateModule} from "./directives/template/index.directive";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    SelectModule,
    DatePickerModule,
    TemplateModule,
  ]
})
export class DevModule {
}

