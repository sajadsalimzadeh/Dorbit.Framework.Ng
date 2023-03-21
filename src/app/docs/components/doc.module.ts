import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DocCardModule} from "./card/index.module";

const MODULES: any[] = [
  CommonModule,
  DocCardModule,
]

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class DocModule {
}
