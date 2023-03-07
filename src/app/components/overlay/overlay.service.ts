import {ComponentRef, EventEmitter, Injectable, TemplateRef} from "@angular/core";
import {DomService} from "../../services/dom.service";
import {OverlayComponent} from "./overlay.component";

export interface OverlayRef {
  componentRef: ComponentRef<OverlayComponent>;

  destroy: () => void;
  onDestroy: EventEmitter<any>;
}

const defaultOptions = {
  singleton: true
}

@Injectable({providedIn: 'root'})
export class OverlayService {
  refs: OverlayRef[] = [];

  constructor(private domService: DomService) {
  }

  createByTemplate(element: HTMLElement, template: TemplateRef<any>, options= defaultOptions) {
    if(options.singleton) {
      this.refs.forEach(x => x.destroy());
    }

    const componentRef = this.domService.createByComponent(OverlayComponent);
    const component = componentRef.instance;
    component.relatedElement = element;
    component.template = template;
    const overlayRef = {
      componentRef: componentRef,
      destroy: () => {
        componentRef.destroy();
        overlayRef.onDestroy.emit();
        this.refs.splice(this.refs.indexOf(overlayRef), 1);
      },
      onDestroy: new EventEmitter<any>()
    } as OverlayRef;
    component.overlayRef = overlayRef;
    componentRef.onDestroy = () => { overlayRef.destroy(); };
    this.refs.push(overlayRef)
    return overlayRef;
  }
}
