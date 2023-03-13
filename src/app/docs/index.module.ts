import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: IndexComponent, children: [

        {path: 'timeline', loadChildren: () => import('./timeline/index.module').then(x => x.Module)},
        {path: 'data-table', loadChildren: () => import('./data-table/index.module').then(x => x.Module)},
        {path: 'forms', loadChildren: () => import('./forms/index.module').then(x => x.Module)},
        {path: 'button', loadChildren: () => import('./button/index.module').then(x => x.Module)},
        {path: 'color-pallet-pallet', loadChildren: () => import('./color-pallet/index.module').then(x => x.Module)},
        {path: 'paginator', loadChildren: () => import('./paginator/index.module').then(x => x.Module)},
        {path: 'scroll-top', loadChildren: () => import('./scroll-top/index.module').then(x => x.Module)},
        {path: 'progress-bar', loadChildren: () => import('./progress-bar/index.module').then(x => x.Module)},
        {path: 'skeleton', loadChildren: () => import('./skeleton/index.module').then(x => x.Module)},
      ]
    }])
  ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
