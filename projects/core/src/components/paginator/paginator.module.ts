import {NgModule} from '@angular/core';

import {PaginatorComponent} from './paginator.component';
import {CommonModule} from "@angular/common";

export * from './paginator.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PaginatorComponent],
  exports: [PaginatorComponent],
  providers: [],
})
export class PaginatorModule {
}
