import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DorbitModule} from "@core";
import {DocModule} from "../../../components/doc.module";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{path: '', component: IndexComponent}]),

        DorbitModule,
        DocModule,
    ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
