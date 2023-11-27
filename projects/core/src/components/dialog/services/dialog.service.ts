import {ComponentRef, EventEmitter, Injectable, Type} from "@angular/core";
import {DomService} from "../../../services";
import {DialogComponent, DialogOptions} from "../components/dialog/dialog.component";
import {DialogContainerComponent} from "../dialog-container.component";
import {PromptComponent, PromptOptions} from "../components/prompt/prompt.component";

export interface DialogRef {
  close: () => void;
  onClose: EventEmitter<void>;
}

@Injectable({providedIn: 'root'})
export class DialogService {
  containers: DialogContainerComponent[] = [];

  constructor(private domService: DomService) {
  }

  private create<T extends DialogRef>(component: Type<T>, init: (obj: ComponentRef<T>, container?: DialogContainerComponent) => void, name?: string) {
    const container = this.containers.find(x => x.name == name);
    const componentRef = this.domService.createByComponent(component, container?.elementRef.nativeElement);
    init(componentRef, container);
    return {
      close: () => {
        componentRef.instance.close();
      },
      onClose: componentRef.instance.onClose
    };
  }

  open(options: DialogOptions): DialogRef {
    return this.create(DialogComponent, (componentRef, container) => {
      const parentElement = container?.elementRef.nativeElement.parentNode as HTMLElement;
      options.maxHeight ??= `calc(${parentElement.clientHeight || document.body.clientHeight}px - 1.6rem)`;
      Object.assign(componentRef.instance, options);
      componentRef.instance.componentRef = componentRef;
    }, options.container);
  }

  prompt(prompt: PromptOptions, dialogOptions?: DialogOptions) {
    return this.create(PromptComponent, (componentRef) => {
      componentRef.instance.options = dialogOptions;
      Object.assign(componentRef.instance, prompt);

    });
  }
}
