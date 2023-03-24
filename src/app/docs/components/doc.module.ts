import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DocCardModule} from "./card/index.module";
import {DorbitModule} from "../../core/dorbit.module";

const MODULES: any[] = [
  CommonModule,
  DocCardModule,
  DorbitModule,
]

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class DocModule {
}
