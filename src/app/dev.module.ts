import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableModule} from "./components/data-table/index.module";
import {SelectModule} from "./components/form/select/index.module";
import {DatePickerModule} from "./components/form/date-picker/date-picker.module";
import {TemplateModule} from "./directives/template/template.directive";
import {HttpClientModule} from "@angular/common/http";
import {OverlayModule} from "./components/overlay/overlay.module";
import {GlobalErrorHandler} from "./services/error-handler.service";

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
    OverlayModule,
  ],
})
export class DevModule {

  static forRoot(): ModuleWithProviders<DevModule> {
    return {
      ngModule: DevModule,
      providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler }
      ]
    }
  }
}

