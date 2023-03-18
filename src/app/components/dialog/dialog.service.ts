import {Injectable} from "@angular/core";
import {DomService} from "../../services/dom.service";
import {DialogComponent, DialogOptions} from "./dialog.component";

@Injectable({providedIn: 'root'})
export class DialogService {

  constructor(private domService: DomService) {
  }

  show(options?: DialogOptions) {
    const componentRef = this.domService.createByComponent(DialogComponent);
    Object.assign(componentRef.instance, options);
    componentRef.instance.componentRef = componentRef;
    return componentRef;
  }
}
