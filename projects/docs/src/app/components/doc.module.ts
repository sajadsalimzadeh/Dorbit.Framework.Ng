import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DorbitModule} from "@core";
import {DocCardModule} from "./card/index.module";
import {CodeModule} from "./code/code.module";

const MODULES: any[] = [
  CommonModule,
  DocCardModule,
  DorbitModule,
  CodeModule,
]

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class DocModule {
}
