import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    TableModule,
    SelectComponent,
    DatePickerComponent,
    OverlayModule,
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
    MessageModule,
    DialogModule,
    StepperStepDirective,
    TabTemplateDirective,
} from './components';
import {
    TemplateDirective,
    KeyFilterDirective,
    TooltipDirective,
    ResponsiveDirective,
    HotKeyDirective,
} from './directives';
import {
    DatePipe,
    JDatePipe,
    RDatePipe,
    TruncatePipe,
} from './pipes';
import {
    GlobalErrorHandler
} from './services';
import {TranslateModule} from "@ngx-translate/core";

export const ALL_COMPONENTS = [
    TableModule,
    OverlayModule,
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
    MessageModule,
    DialogModule,
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

export const ALL_DORBIT_MODULES = [
    ...ALL_COMPONENTS,
    ...ALL_DIRECTIVES,
    ...ALL_PIPES
]

@NgModule({
    imports: [CommonModule, ...ALL_DORBIT_MODULES],
    declarations: [],
    exports: [
        FormsModule,
        CommonModule,
        RouterModule,
        TranslateModule,
        HttpClientModule,
        ReactiveFormsModule,
        
        ...ALL_DORBIT_MODULES
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

