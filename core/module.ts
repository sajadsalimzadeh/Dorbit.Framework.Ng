import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from './components/table/table.module';
import {OverlayModule} from './components/overlay/overlay.module';
import {MessageModule} from './components/message/message.module';
import {DialogModule} from './components/dialog/dialog.module';
import {SelectComponent} from './components/form/select/select.component';
import {DatePickerComponent} from './components/form/date-picker/date-picker.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {ButtonComponent} from './components/button/button.component';
import {CheckboxComponent} from './components/form/checkbox/checkbox.component';
import {InputComponent} from './components/form/input/input.component';
import {ControlGroupComponent} from './components/form/control-group/control-group.component';
import {ButtonGroupComponent} from './components/button-group/button-group.component';
import {ChipsComponent} from './components/form/chips/chips.component';
import {SwitchComponent} from './components/form/switch/switch.component';
import {RadioComponent} from './components/form/radio/radio.component';
import {RateComponent} from './components/form/rate/rate.component';
import {VolumeComponent} from './components/form/volume/volume.component';
import {PaginatorComponent} from './components/paginator/paginator.component';
import {ColorPickerComponent} from './components/form/color-picker/color-picker.component';
import {PasswordComponent} from './components/form/password/password.component';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {ScrollTopComponent} from './components/scroll-top/scroll-top.component';
import {ShimmerComponent} from './components/skeleton/shimmer.component';
import {CardComponent} from './components/card/card.component';
import {TagComponent} from './components/tag/tag.component';
import {TabComponent, TabTemplateDirective} from './components/tab/tab.component';
import {TreeComponent} from './components/tree/tree.component';
import {DatePickerInlineComponent} from './components/form/date-picker-inline/date-picker-inline.component';
import {ListComponent} from './components/list/list.component';
import {StepperComponent, StepperStepDirective} from './components/stepper/stepper.component';
import {ProgressCircleComponent} from './components/progress-circle/progress-circle.component';
import {PositionComponent} from './components/position/position.component';
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {FabComponent} from './components/fab/fab.component';
import {InputSplitComponent} from './components/form/input-split/input-split.component';

import {TemplateDirective} from './directives/template.directive';
import {KeyFilterDirective} from './directives/key-filter.directive';
import {TooltipDirective} from './directives/tooltip.directive';
import {ResponsiveDirective} from './directives/responsive.directive';
import {HotKeyDirective} from './directives/hot-key.directive';

import {DatePipe} from './pipes/date.pipe';
import {JDatePipe} from './pipes/jdate.pipe';
import {RDatePipe} from './pipes/rdate.pipe';
import {TruncatePipe} from './pipes/truncate.pipe';
import { NumberSanitizerDirective } from "./directives/number-sanitizer.directive";

export const ALL_MODULES = [
    TableModule,
    OverlayModule,
    MessageModule,
    DialogModule,
]

export const ALL_COMPONENTS = [
    SelectComponent,
    DatePickerComponent,
    TimelineComponent,
    ButtonComponent,
    CheckboxComponent,
    InputComponent,
    ControlGroupComponent,
    ButtonGroupComponent,
    ChipsComponent,
    SwitchComponent,
    RadioComponent,
    RateComponent,
    VolumeComponent,
    PaginatorComponent,
    ColorPickerComponent,
    PasswordComponent,
    ProgressBarComponent,
    ScrollTopComponent,
    ShimmerComponent,
    CardComponent,
    TagComponent,
    TabComponent,
    TreeComponent,
    DatePickerInlineComponent,
    ListComponent,
    StepperComponent,
    ProgressCircleComponent,
    PositionComponent,
    BreadcrumbComponent,
    FabComponent,
    InputSplitComponent,
    NumberSanitizerDirective,
];

export const ALL_DIRECTIVES = [
    TemplateDirective,
    KeyFilterDirective,
    TooltipDirective,
    ResponsiveDirective,
    HotKeyDirective,
    StepperStepDirective,
    TabTemplateDirective,
];

export const ALL_PIPES = [
    DatePipe,
    JDatePipe,
    RDatePipe,
    TruncatePipe,
];

@NgModule({
    imports: [
        CommonModule,
        ALL_COMPONENTS,
        ALL_DIRECTIVES,
        ALL_PIPES,
    ],
    declarations: [],
    exports: [
        FormsModule,
        CommonModule,
        RouterModule,
        TranslateModule,
        ReactiveFormsModule,

        ALL_MODULES,
        ALL_COMPONENTS,
        ALL_DIRECTIVES,
        ALL_PIPES,
    ],
})
export class DorbitModule {
    static forRoot(): ModuleWithProviders<DorbitModule> {

        return {
            ngModule: DorbitModule,
            providers: []
        }
    }
}
