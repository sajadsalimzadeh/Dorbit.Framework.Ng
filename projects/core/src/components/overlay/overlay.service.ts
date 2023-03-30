import {ComponentRef, EventEmitter, Injectable, TemplateRef} from "@angular/core";
import {DomService} from "../../services/dom.service";
import {OverlayComponent, OverlayOptions} from "./overlay.component";

export interface OverlayRef {
  componentRef: ComponentRef<OverlayComponent>;

  destroy: () => void;
  onDestroy: EventEmitter<any>;
}

@Injectable({providedIn: 'root'})
export class OverlayService {
  refs: OverlayRef[] = [];
  singleton = true;
  defaultOptions: OverlayOptions = {}

  constructor(private domService: DomService) {
  }

  create(options= this.defaultOptions) {
    if(this.singleton) {
      this.refs.forEach(x => x.destroy());
    }
    if(!options.targetElement) options.targetElement = document.body;

    const componentRef = this.domService.createByComponent(OverlayComponent);
    const component = componentRef.instance;
    Object.assign(component, options);
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
