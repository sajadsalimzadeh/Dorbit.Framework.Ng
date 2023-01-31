import {Injectable, TemplateRef} from "@angular/core";
import {DomService} from "../../services/dom.service";
import {OverlayComponent} from "./overlay.component";

@Injectable({providedIn: 'root'})
export class OverlayService {

  constructor(private domService: DomService) {
  }

  createByTemplate(element: HTMLElement, template: TemplateRef<any>) {
    const componentRef = this.domService.createByComponent(OverlayComponent);
    const component = componentRef.instance;

    component.relatedElement = element;
    component.template = template;
    component.componentRef = componentRef;
    return componentRef;
  }
}
