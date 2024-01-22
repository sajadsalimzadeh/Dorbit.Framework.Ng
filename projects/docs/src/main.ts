import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {importProvidersFrom} from "@angular/core";
import {RouterModule} from "@angular/router";
import {HIGHLIGHT_OPTIONS} from "ngx-highlightjs";
import {TranslateModule} from "@ngx-translate/core";


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot([
      {path: 'get-started', loadChildren: () => import('./app/pages/get-started/index.module').then(x => x.Module)},
      {path: 'timeline', loadChildren: () => import('./app/pages/timeline/index.module').then(x => x.Module)},
      {path: 'table', loadChildren: () => import('./app/pages/table/index.module').then(x => x.Module)},
      {path: 'grid', loadChildren: () => import('./app/pages/grid/index.module').then(x => x.Module)},
      {path: 'forms', loadChildren: () => import('./app/pages/forms/index.module').then(x => x.Module)},
      {path: 'button', loadChildren: () => import('./app/pages/button/index.module').then(x => x.Module)},
      {path: 'color-pallet', loadChildren: () => import('./app/pages/color-pallet/index.module').then(x => x.Module)},
      {path: 'paginator', loadChildren: () => import('./app/pages/paginator/index.module').then(x => x.Module)},
      {path: 'scroll-top', loadChildren: () => import('./app/pages/scroll-top/index.module').then(x => x.Module)},
      {path: 'progress-bar', loadChildren: () => import('./app/pages/progress-bar/index.module').then(x => x.Module)},
      {path: 'shimmer', loadChildren: () => import('./app/pages/shimmer/index.module').then(x => x.Module)},
      {path: 'tab', loadChildren: () => import('./app/pages/tab/index.module').then(x => x.Module)},
      {path: 'tag', loadChildren: () => import('./app/pages/tag/index.module').then(x => x.Module)},
      {path: 'message', loadChildren: () => import('./app/pages/message/index.module').then(x => x.Module)},
      {path: 'dialog', loadChildren: () => import('./app/pages/dialog/index.module').then(x => x.Module)},
      {path: 'tooltip', loadChildren: () => import('./app/pages/tooltip/index.module').then(x => x.Module)},
      {path: 'code', loadChildren: () => import('./app/pages/code/index.module').then(x => x.Module)},
      {path: 'tree', loadChildren: () => import('./app/pages/tree/index.module').then(x => x.Module)},
    ], {useHash: true})),
    importProvidersFrom(TranslateModule.forRoot()),
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
  ]
}).catch(err => console.error(err));
