import {Injectable} from "@angular/core";
import {DomService} from "../../services/dom.service";
import {DialogComponent, DialogOptions} from "./dialog.component";

export interface DialogRef {
  close: () => void;
}

@Injectable({providedIn: 'root'})
export class DialogService {

  constructor(private domService: DomService) {
  }

  show(options?: DialogOptions): DialogRef {
    const componentRef = this.domService.createByComponent(DialogComponent);
    Object.assign(componentRef.instance, options);
    componentRef.instance.componentRef = componentRef;
    return {
      close: () => {
        componentRef.instance.close();
      }
    };
  }
}
