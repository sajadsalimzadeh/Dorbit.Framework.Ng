import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '', component: IndexComponent, children: [
        {path: 'date-picker', loadChildren: () => import('./date-picker/index.module').then(x => x.Module)},
        {path: 'input', loadChildren: () => import('./input/index.module').then(x => x.Module)},
        {path: 'select', loadChildren: () => import('./select/index.module').then(x => x.Module)},
        {path: 'chips', loadChildren: () => import('./chips/index.module').then(x => x.Module)},
        {path: 'checkbox', loadChildren: () => import('./checkbox/index.module').then(x => x.Module)},
        {path: 'switch', loadChildren: () => import('./switch/index.module').then(x => x.Module)},
        {path: 'radio', loadChildren: () => import('./radio/index.module').then(x => x.Module)},
        {path: 'rate', loadChildren: () => import('./rate/index.module').then(x => x.Module)},
        {path: 'volume', loadChildren: () => import('./volume/index.module').then(x => x.Module)},
        {path: 'color-picker', loadChildren: () => import('./color-picker/index.module').then(x => x.Module)},
      ]
    }])
  ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
