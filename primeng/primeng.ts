import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {TranslateModule} from '@ngx-translate/core';

import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {TextareaModule} from 'primeng/textarea';
import {InputMaskModule} from "primeng/inputmask";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputOtpModule} from "primeng/inputotp";
import {PasswordModule} from "primeng/password";
import {CheckboxModule} from "primeng/checkbox";
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {TooltipModule} from "primeng/tooltip";
import {InputNumberModule} from 'primeng/inputnumber';
import {InputGroupModule} from "primeng/inputgroup";
import {ToastModule} from 'primeng/toast';
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {MultiSelectModule} from 'primeng/multiselect';
import {IftaLabelModule} from 'primeng/iftalabel';
import {SelectModule} from 'primeng/select';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {PanelMenuModule} from 'primeng/panelmenu';
import {TreeModule} from 'primeng/tree';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {AutoFocusModule} from 'primeng/autofocus';
import {ChipModule} from "primeng/chip";
import {FieldsetModule} from 'primeng/fieldset';
import {TabsModule} from "primeng/tabs";
import {RippleModule} from "primeng/ripple";
import {SkeletonModule} from 'primeng/skeleton';


import {CustomDialogComponent} from "./components/custom-dialog/custom-dialog.component";
import {CustomTableComponent} from "./components/custom-table/custom-table.component";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PaginatorModule} from 'primeng/paginator';
import {ProgressBarModule} from 'primeng/progressbar';
import {ButtonGroupModule} from 'primeng/buttongroup';
import {JalaliDatePickerComponent} from './components/jalali-date-picker/jalali-date-picker.component';

const COMPONENTS = [
    CustomTableComponent,
    CustomDialogComponent,
];

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
    DropdownModule,
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
];

const MODULES = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    JalaliDatePickerComponent
]

@NgModule({
    imports: [
        ...MODULES,
        ...PRIMENG_MODULES,
    ],
    exports: [
        ...MODULES,
        ...PRIMENG_MODULES,
        ...COMPONENTS
    ],
    declarations: [
        ...COMPONENTS
    ],
    providers: [],
})
export class PrimengModule {
}
