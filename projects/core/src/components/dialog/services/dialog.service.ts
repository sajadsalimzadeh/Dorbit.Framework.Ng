import {ComponentRef, EventEmitter, Injectable, Type} from "@angular/core";
import {NavigationStart, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
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

  constructor(private domService: DomService, private translateService: TranslateService, router: Router) {

    router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (this._refs.length > 0) {
          this._refs[this._refs.length - 1].close();
        }
      }
    })
  }

  private create<T extends DialogRef>(component: Type<T>, init: (obj: ComponentRef<T>, container?: DialogContainerComponent) => void, name?: string) {
    const container = this.containers.find(x => x.name == name);
    const componentRef = this.domService.createByComponent(component, container?.elementRef.nativeElement);
    init(componentRef, container);
    componentRef.instance.onClose.subscribe(e => {
      const index = this._refs.indexOf(componentRef.instance);
      if (index > -1) this._refs.splice(index, 1);
    });
    this._refs.push(componentRef.instance);
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

  confirmYesNo(yes: (dialog: DialogRef) => void, no?: (dialog: DialogRef) => void, confirmOptions?: {message: string}, dialogOptions?: DialogOptions) {
    const dialog = this.confirm({
      ...confirmOptions,
      buttons: [
        {
          text: this.translateService.instant('yes'),
          color: 'success',
          action: () => yes(dialog)
        },
        {
          text: this.translateService.instant('no'),
          color: 'danger',
          action: () => {
            dialog.close();
            if (no) no(dialog);
          }
        }
      ]
    }, {
      closable: false,
      title: this.translateService.instant('message.are-you-sure'),
      ...dialogOptions
    });
    return dialog;
  }

  prompt(options: PromptOptions, dialogOptions?: DialogOptions) {
    return new Promise<{ result: boolean, value?: string, dialog: PromptComponent }>((resolve) => {
      const dialog = this.create(PromptComponent, (componentRef) => {
        componentRef.instance.options = dialogOptions;
        Object.assign(componentRef.instance, options);
      });

      dialog.onResult.subscribe((e) => {
        dialog.close();
        resolve({
          result: e,
          value: dialog.value,
          dialog: dialog
        });
      });
    });
  }

  closeAll() {
    [...this._refs].forEach(x => x.close())
  }
}
