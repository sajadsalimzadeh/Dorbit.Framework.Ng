import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableModule} from "./components/data-table/index.module";
import {SelectModule} from "./components/form/select/select.module";
import {DatePickerModule} from "./components/form/date-picker/date-picker.module";
import {DevTemplateModule} from "./directives/template/dev-template.directive";
import {HttpClientModule} from "@angular/common/http";
import {OverlayModule} from "./components/overlay/overlay.module";
import {GlobalErrorHandler} from "./services/error-handler.service";
import {TimelineModule} from "./components/timeline/timeline.module";
import {ButtonModule} from "./components/button/button.module";
import {CheckboxModule} from "./components/form/checkbox/checkbox.module";
import {InputModule} from "./components/form/input/input.module";
import {ControlGroupModule} from "./components/form/control-group/control-group.module";
import {ButtonGroupModule} from "./components/button-group/button-group.module";
import {ChipsModule} from "./components/form/chips/chips.module";
import {SwitchModule} from "./components/form/switch/switch.module";
import {RadioModule} from "./components/form/radio/radio.module";
import {RateModule} from "./components/form/rate/rate.module";
import {VolumeModule} from "./components/form/volume/volume.module";
import {PaginatorModule} from "./components/paginator/paginator.module";
import {ColorPickerModule} from "./components/form/color-picker/color-picker.module";
import {KeyFilterModule} from "./directives/key-filter/key-filter.directive";
import {PasswordModule} from "./components/form/password/password.module";
import {ProgressBarModule} from "./components/progress-bar/progress-bar.module";
import {ScrollTopModule} from "./components/scroll-top/scroll-top.module";
import {SkeletonModule} from "./components/skeleton/skeleton.module";
import {CardModule} from "./components/card/card.module";
import {TagModule} from "./components/tag/tag.module";
import {MessagesModule} from "./components/message/messages.module";
import {DialogModule} from "./components/dialog/dialog.module";

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
  ],
})
export class DevModule {

  static forRoot(): ModuleWithProviders<DevModule> {
    return {
      ngModule: DevModule,
      providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
      ]
    }
  }
}

