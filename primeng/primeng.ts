import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from "primeng/inputmask";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputOtpModule } from "primeng/inputotp";
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from "primeng/checkbox";
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from "primeng/inputgroup";
import { ToastModule } from 'primeng/toast';
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { MultiSelectModule } from 'primeng/multiselect';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TreeModule } from 'primeng/tree';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AutoFocusModule } from 'primeng/autofocus';
import { ChipModule } from "primeng/chip";
import { FieldsetModule } from 'primeng/fieldset';
import { TabsModule } from "primeng/tabs";
import { RippleModule } from "primeng/ripple";
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { KeyFilterModule } from 'primeng/keyfilter';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeSelectModule } from "primeng/treeselect";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SliderModule } from 'primeng/slider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ScrollPanelModule } from "primeng/scrollpanel";
import { RatingModule } from "primeng/rating";
import { PopoverModule } from "primeng/popover";
import { ListboxModule } from "primeng/listbox";
import { DividerModule } from "primeng/divider";
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { SplitterModule } from 'primeng/splitter';
import { TagModule } from 'primeng/tag';
import { StepperModule } from 'primeng/stepper';
import { MessageModule } from 'primeng/message';
import { CascadeSelectModule } from 'primeng/cascadeselect';

import { CustomDialogComponent } from "./components/custom-dialog/custom-dialog.component";
import { CustomTableComponent } from "./components/custom-table/custom-table.component";
import { DynamicDatePickerComponent } from './components/dynamic-date-picker/dynamic-date-picker.component';
import { CustomCheckboxComponent } from './components/custom-checkbox/custom-checkbox.component';
import { AutoFocusDirective } from './components/auto-focus.directive';
import { InputOtpDirective } from './components/input-otp.directive';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CustomAlertComponent } from './components/custom-alert/custom-alert.component';
import { SelectDialogComponent } from './components/select-dialog/select-dialog.component';
import { ImagePickerComponent } from './components/image-picker/index.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { CustomDatePickerComponent } from './components/custom-date-picker/custom-date-picker.component';
import { GroupOperationResultComponent } from './components/group-operation-result/index.component';

const COMPONENTS = [
    CustomTableComponent,
    CustomDialogComponent,
    CustomCheckboxComponent,
    CustomAlertComponent,
    AutoFocusDirective,
    SelectDialogComponent,
    ImagePickerComponent,
    ErrorMessageComponent,
    CustomDatePickerComponent,
    GroupOperationResultComponent,
];

const MODULES = [
    DynamicDatePickerComponent,
    InputOtpDirective,
    ImageCropperComponent,
    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
]

const PRIMENG_MODULES = [
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    FloatLabelModule,
    RouterModule,
    TextareaModule,
    InputOtpModule,
    InputGroupModule,
    InputGroupAddonModule,
    PasswordModule,
    CheckboxModule,
    CardModule,
    TableModule,
    DialogModule,
    TooltipModule,
    InputNumberModule,
    ToastModule,
    MultiSelectModule,
    IftaLabelModule,
    SelectModule,
    BreadcrumbModule,
    PanelMenuModule,
    TreeModule,
    MenubarModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    ConfirmPopupModule,
    AutoFocusModule,
    ChipModule,
    FieldsetModule,
    TabsModule,
    RippleModule,
    SkeletonModule,
    ConfirmDialogModule,
    PaginatorModule,
    ProgressBarModule,
    ButtonGroupModule,
    KeyFilterModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    IconFieldModule,
    InputIconModule,
    SliderModule,
    ToggleSwitchModule,
    TreeSelectModule,
    ScrollPanelModule,
    RatingModule,
    PopoverModule,
    ListboxModule,
    DividerModule,
    FileUploadModule,
    DatePickerModule,
    SplitterModule,
    TagModule,
    StepperModule,
    SelectButtonModule,
    MessageModule,
    CascadeSelectModule
];

@NgModule({
    imports: [
        PRIMENG_MODULES,
        MODULES,
    ],
    exports: [
        PRIMENG_MODULES,
        MODULES,
        COMPONENTS
    ],
    declarations: [
        COMPONENTS
    ],
    providers: [],
})
export class PrimengModule {
}
