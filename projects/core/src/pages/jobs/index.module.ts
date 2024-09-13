import {NgModule} from '@angular/core';

import {IndexComponent} from './index.component';
import {RouterModule} from "@angular/router";
import {LogComponent} from "./logs/index.component";
import {DorbitModule} from "../../dorbit.module";

@NgModule({
  imports: [
    DorbitModule,
    RouterModule.forChild([{path: '', component: IndexComponent}])
  ],
  declarations: [IndexComponent, LogComponent],
  exports: [],
  providers: [],
})
export class IndexModule {
}
