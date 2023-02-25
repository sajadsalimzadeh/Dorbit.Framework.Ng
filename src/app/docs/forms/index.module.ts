import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '', component: IndexComponent, children: [
        {path: 'date-picker', loadChildren: () => import('./date-picker/index.module').then(x => x.Module)}
      ]
    }])
  ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
