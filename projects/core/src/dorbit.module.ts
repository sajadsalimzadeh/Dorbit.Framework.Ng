import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  TableModule,
  SelectModule,
  DatePickerModule,
  OverlayModule,
  TimelineModule,
  ButtonModule,
  CheckboxModule,
  InputModule,
  ControlGroupModule,
  ButtonGroupModule,
  ChipsModule,
  SwitchModule,
  RadioModule,
  RateModule,
  VolumeModule,
  PaginatorModule,
  ColorPickerModule,
  PasswordModule,
  ProgressBarModule,
  ScrollTopModule,
  SkeletonModule,
  CardModule,
  TagModule,
  MessagesModule,
  DialogModule,
  TabModule,
  CodeModule,
  TreeModule,
  DatePickerInlineModule,
} from './components';
import {
  JDatePipeModule,
  RDatePipeModule,
} from './pipes';
import {
  DevTemplateModule,
  KeyFilterModule,
  TooltipModule,
} from './directives';
import {
  GlobalErrorHandler
} from './services';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

const MODULES = [
  TableModule,
  SelectModule,
  DatePickerModule,
  DevTemplateModule,
  OverlayModule,
  TimelineModule,
  ButtonModule,
  CheckboxModule,
  InputModule,
  ControlGroupModule,
  ButtonGroupModule,
  ChipsModule,
  SwitchModule,
  RadioModule,
  RateModule,
  VolumeModule,
  PaginatorModule,
  ColorPickerModule,
  KeyFilterModule,
  PasswordModule,
  ProgressBarModule,
  ScrollTopModule,
  SkeletonModule,
  CardModule,
  TagModule,
  MessagesModule,
  DialogModule,
  TooltipModule,
  TabModule,
  CodeModule,
  TreeModule,
  JDatePipeModule,
  RDatePipeModule,
  DatePickerInlineModule,
];

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,

    ...MODULES
  ],
})
export class DorbitModule {

  static forRoot(): ModuleWithProviders<DorbitModule> {
    return {
      ngModule: DorbitModule,
      providers: [
        {provide: ErrorHandler, useClass: GlobalErrorHandler},
      ]
    }
  }
}

