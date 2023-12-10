import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
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
  ShimmerModule,
  CardModule,
  TagModule,
  MessageModule,
  DialogModule,
  TabModule,
  TreeModule,
  DatePickerInlineModule,
  ListModule,
  TemplateModule,
  KeyFilterModule,
  TooltipModule,
  InputSplitModule,
  StepperModule,
  ProgressCircleModule,
  PositionModule,
  DateModule,
  BreadcrumbModule,
} from './components';
import {
  JDatePipeModule,
  RDatePipeModule,
} from './pipes';
import {
  GlobalErrorHandler
} from './services';

const MODULES = [
  TableModule,
  SelectModule,
  DatePickerModule,
  TemplateModule,
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
  ShimmerModule,
  CardModule,
  TagModule,
  MessageModule,
  DialogModule,
  TooltipModule,
  TabModule,
  TreeModule,
  JDatePipeModule,
  RDatePipeModule,
  DatePickerInlineModule,
  ListModule,
  InputSplitModule,
  StepperModule,
  ProgressCircleModule,
  PositionModule,
  DateModule,
  BreadcrumbModule,
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

