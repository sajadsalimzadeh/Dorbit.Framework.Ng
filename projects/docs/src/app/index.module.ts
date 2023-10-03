import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {HIGHLIGHT_OPTIONS} from "ngx-highlightjs";
import {IndexComponent} from "./index.component";
import {DorbitModule} from "@dorbit";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    DorbitModule,
    RouterModule.forRoot([
      {path: 'get-started', loadChildren: () => import('./pages/get-started/index.module').then(x => x.Module)},
      {path: 'timeline', loadChildren: () => import('./pages/timeline/index.module').then(x => x.Module)},
      {path: 'table', loadChildren: () => import('./pages/table/index.module').then(x => x.Module)},
      {path: 'grid', loadChildren: () => import('./pages/grid/index.module').then(x => x.Module)},
      {path: 'forms', loadChildren: () => import('./pages/forms/index.module').then(x => x.Module)},
      {path: 'button', loadChildren: () => import('./pages/button/index.module').then(x => x.Module)},
      {path: 'color-pallet', loadChildren: () => import('./pages/color-pallet/index.module').then(x => x.Module)},
      {path: 'paginator', loadChildren: () => import('./pages/paginator/index.module').then(x => x.Module)},
      {path: 'scroll-top', loadChildren: () => import('./pages/scroll-top/index.module').then(x => x.Module)},
      {path: 'progress-bar', loadChildren: () => import('./pages/progress-bar/index.module').then(x => x.Module)},
      {path: 'skeleton', loadChildren: () => import('./pages/skeleton/index.module').then(x => x.Module)},
      {path: 'tab', loadChildren: () => import('./pages/tab/index.module').then(x => x.Module)},
      {path: 'tag', loadChildren: () => import('./pages/tag/index.module').then(x => x.Module)},
      {path: 'message', loadChildren: () => import('./pages/message/index.module').then(x => x.Module)},
      {path: 'dialog', loadChildren: () => import('./pages/dialog/index.module').then(x => x.Module)},
      {path: 'tooltip', loadChildren: () => import('./pages/tooltip/index.module').then(x => x.Module)},
      {path: 'code', loadChildren: () => import('./pages/code/index.module').then(x => x.Module)},
      {path: 'tree', loadChildren: () => import('./pages/tree/index.module').then(x => x.Module)},
    ], {useHash: true}),
    FormsModule,
  ],
  declarations: [IndexComponent,],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml')
        },
      }
    }
  ],
  bootstrap: [IndexComponent]
})
export class IndexModule {


}
