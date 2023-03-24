import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {DorbitModule} from "./core/dorbit.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {HIGHLIGHT_OPTIONS} from "ngx-highlightjs";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot([
      {path: '', loadChildren: () => import('./docs/pages/index.module').then(x => x.Module)}
    ], {useHash: true}),
    DorbitModule.forRoot(),
    FormsModule,
  ],
  declarations: [
    AppComponent,
  ],
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
  bootstrap: [AppComponent]
})
export class AppModule {


}
