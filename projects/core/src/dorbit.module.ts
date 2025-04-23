import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    BreadcrumbComponent,
    ButtonComponent,
    ButtonGroupComponent,
    CardComponent,
    CheckboxComponent,
    ChipsComponent,
    ColorPickerComponent,
    ControlGroupComponent,
    DatePickerComponent,
    DatePickerInlineComponent,
    DialogModule,
    FabComponent,
    InputComponent,
    InputSplitComponent,
    ListComponent,
    MessageModule,
    OverlayModule,
    PaginatorComponent,
    PasswordComponent,
    PositionComponent,
    ProgressBarComponent,
    ProgressCircleComponent,
    RadioComponent,
    RateComponent,
    ScrollTopComponent,
    SelectComponent,
    ShimmerComponent,
    StepperComponent,
    StepperStepDirective,
    SwitchComponent,
    TabComponent,
    TableModule,
    TabTemplateDirective,
    TagComponent,
    TimelineComponent,
    TreeComponent,
    VolumeComponent,
} from './components/_public';
import {HotKeyDirective, KeyFilterDirective, ResponsiveDirective, TemplateDirective, TooltipDirective,} from './directives/_public';
import {DatePipe, JDatePipe, RDatePipe, TruncatePipe,} from './pipes/_public';

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
            providers: [
            ]
        }
    }
}

