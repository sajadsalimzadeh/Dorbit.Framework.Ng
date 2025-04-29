import {NgModule} from '@angular/core';
import {DialogContainerComponent} from "./dialog-container.component";
import {DialogComponent} from "./components/dialog/dialog.component";
import {PromptComponent} from "./components/prompt/prompt.component";
import {ConfirmComponent} from "./components/confirm/confirm.component";

export * from './services/dialog.service';
export * from './dialog-container.component';
export * from './components/confirm/confirm.component';
export * from './components/prompt/prompt.component';
export * from './components/dialog/dialog.component';

const COMPONENTS = [
    DialogComponent,
    PromptComponent,
    ConfirmComponent,
]

@NgModule({
    imports: [...COMPONENTS],
    declarations: [DialogContainerComponent],
    exports: [DialogContainerComponent, ...COMPONENTS],
    providers: [],
})
export class DialogModule {
}
