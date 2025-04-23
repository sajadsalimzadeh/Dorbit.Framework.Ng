import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DorbitModule} from "@framework";
import {DocModule} from "../../components/doc.module";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {path: '', pathMatch: 'full', component: IndexComponent},
            {path: 'basic', loadChildren: () => import('./basic/index.module').then(x => x.Module)},
            {path: 'column-group', loadChildren: () => import('./column-group/index.module').then(x => x.Module)},
            {path: 'column-reorder', loadChildren: () => import('./column-reorder/index.module').then(x => x.Module)},
            {path: 'column-resize', loadChildren: () => import('./column-resize/index.module').then(x => x.Module)},
            {path: 'dynamic-column', loadChildren: () => import('./dynamic-columns/index.module').then(x => x.Module)},
            {path: 'filter', loadChildren: () => import('./filter/index.module').then(x => x.Module)},
            {path: 'lazy-load', loadChildren: () => import('./lazy-load/index.module').then(x => x.Module)},
            {path: 'paginator', loadChildren: () => import('./paginator/index.module').then(x => x.Module)},
            {path: 'row-expand', loadChildren: () => import('./row-expand/index.module').then(x => x.Module)},
            {path: 'row-selection', loadChildren: () => import('./row-selection/index.module').then(x => x.Module)},
            {path: 'size', loadChildren: () => import('./size/index.module').then(x => x.Module)},
            {path: 'sort', loadChildren: () => import('./sort/index.module').then(x => x.Module)},
            {path: 'stateful', loadChildren: () => import('./stateful/index.module').then(x => x.Module)},
        ]),

        DorbitModule,
        DocModule,
    ],
    declarations: [
        IndexComponent
    ]
})
export class Module {

}
