import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DorbitModule} from "@dorbit";
import {DocModule} from "../../../components/doc.module";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{path: '', component: IndexComponent}]),

        DorbitModule,
        DocModule,
    ],
    exports: [
        IndexComponent
    ],
    declarations: [
        IndexComponent
    ]
})
export class Module {

}
