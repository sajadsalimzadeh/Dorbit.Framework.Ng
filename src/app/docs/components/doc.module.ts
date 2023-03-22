import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DocCardModule} from "./card/index.module";
import {DevModule} from "../../core/dev.module";

const MODULES: any[] = [
  CommonModule,
  DocCardModule,
  DevModule,
]

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class DocModule {
}
