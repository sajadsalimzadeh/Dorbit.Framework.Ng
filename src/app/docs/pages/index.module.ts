import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {DorbitModule} from "../../core/dorbit.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: IndexComponent, children: [

        {path: 'get-started', loadChildren: () => import('./get-started/index.module').then(x => x.Module)},
        {path: 'timeline', loadChildren: () => import('./timeline/index.module').then(x => x.Module)},
        {path: 'data-table', loadChildren: () => import('./data-table/index.module').then(x => x.Module)},
        {path: 'forms', loadChildren: () => import('./forms/index.module').then(x => x.Module)},
        {path: 'button', loadChildren: () => import('./button/index.module').then(x => x.Module)},
        {path: 'color-pallet', loadChildren: () => import('./color-pallet/index.module').then(x => x.Module)},
        {path: 'paginator', loadChildren: () => import('./paginator/index.module').then(x => x.Module)},
        {path: 'scroll-top', loadChildren: () => import('./scroll-top/index.module').then(x => x.Module)},
        {path: 'progress-bar', loadChildren: () => import('./progress-bar/index.module').then(x => x.Module)},
        {path: 'skeleton', loadChildren: () => import('./skeleton/index.module').then(x => x.Module)},
        {path: 'tab', loadChildren: () => import('./tab/index.module').then(x => x.Module)},
        {path: 'tag', loadChildren: () => import('./tag/index.module').then(x => x.Module)},
        {path: 'message', loadChildren: () => import('./message/index.module').then(x => x.Module)},
        {path: 'dialog', loadChildren: () => import('./dialog/index.module').then(x => x.Module)},
        {path: 'tooltip', loadChildren: () => import('./tooltip/index.module').then(x => x.Module)},
        {path: 'code', loadChildren: () => import('./code/index.module').then(x => x.Module)},
      ]
    }]),
    DorbitModule
  ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
