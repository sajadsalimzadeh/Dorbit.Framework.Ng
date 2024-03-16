import {ComponentRef, EventEmitter, Injectable, Type} from "@angular/core";
import {DomService} from "../../../services";
import {DialogComponent, DialogOptions} from "../components/dialog/dialog.component";
import {ConfirmOptions, DialogContainerComponent, PromptOptions} from "../dialog-container.component";
import {ConfirmComponent} from "../components/confirm/confirm.component";
import {PromptComponent} from "../components/prompt/prompt.component";

export interface DialogRef {
  close: () => void;
  onClose: EventEmitter<void>;
}

@Injectable({providedIn: 'root'})
export class DialogService {
  private _refs: DialogRef[] = [];
  containers: DialogContainerComponent[] = [];

  constructor(private domService: DomService) {

    window.addEventListener('popstate', (e: PopStateEvent) => {
      if(this._refs.length > 0) {
        this._refs[this._refs.length - 1].close();
      }
    });
  }

  private create<T extends DialogRef>(component: Type<T>, init: (obj: ComponentRef<T>, container?: DialogContainerComponent) => void, name?: string) {
    const container = this.containers.find(x => x.name == name);
    const componentRef = this.domService.createByComponent(component, container?.elementRef.nativeElement);
    init(componentRef, container);
    componentRef.instance.onClose.subscribe(e => {
      const index = this._refs.indexOf(componentRef.instance);
      if(index > -1) this._refs.splice(index, 1);
    });
    this._refs.push(componentRef.instance);
    history.pushState({dialog: true}, 'dialog');
    return componentRef.instance;
  }

  open(options: DialogOptions) {
    return this.create(DialogComponent, (componentRef, container) => {
      Object.assign(componentRef.instance, options);
      componentRef.instance.componentRef = componentRef;
    }, options.container);
  }

  confirm(options: ConfirmOptions, dialogOptions?: DialogOptions) {
    return this.create(ConfirmComponent, (componentRef) => {
      componentRef.instance.options = dialogOptions;
      Object.assign(componentRef.instance, options);
    });
  }

  prompt(options: PromptOptions, dialogOptions?: DialogOptions) {
    return new Promise<{ result: boolean, value: string, dialog: PromptComponent }>((resolve) => {
      const dialog = this.create(PromptComponent, (componentRef) => {
        componentRef.instance.options = dialogOptions;
        Object.assign(componentRef.instance, options);
      });

      dialog.onResult.subscribe((e) => {
        resolve({
          result: e,
          value: dialog.control.value,
          dialog: dialog
        });
      });
    });
  }

  closeAll() {
    [...this._refs].forEach(x => x.close())
  }
}
