import {NgModule} from '@angular/core';

import {BreadcrumbComponent} from './breadcrumb.component';
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

export * from './breadcrumb.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [BreadcrumbComponent],
  exports: [BreadcrumbComponent],
  providers: [],
})
export class BreadcrumbModule {
}
