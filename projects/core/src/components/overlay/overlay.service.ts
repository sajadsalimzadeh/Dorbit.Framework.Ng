import {ComponentRef, EventEmitter, Injectable} from "@angular/core";
import {DomService} from "../../services/dom.service";
import {OverlayComponent, OverlayOptions} from "./overlay.component";

export interface OverlayRef {
  autoClose: boolean;
  componentRef: ComponentRef<OverlayComponent>;

  destroy: () => void;
  onDestroy: EventEmitter<any>;
}

@Injectable({providedIn: 'root'})
export class OverlayService {
  refs: OverlayRef[] = [];
  defaultOptions: OverlayOptions = {}

  constructor(private domService: DomService) {
  }

  create(options = this.defaultOptions) {
    this.refs.filter(x => !x.autoClose).forEach(x => x.destroy());
    if (!options.ref) options.ref = document.body;

    const componentRef = this.domService.createByComponent(OverlayComponent);
    const component = componentRef.instance;
    Object.assign(component, options);
    const overlayRef = {
      autoClose: options.autoClose ?? true,
      componentRef: componentRef,
      destroy: () => {
        componentRef.destroy();
        overlayRef.onDestroy.emit();
        this.refs.splice(this.refs.indexOf(overlayRef), 1);
      },
      onDestroy: new EventEmitter<any>()
    } as OverlayRef;
    component.overlayRef = overlayRef;
    componentRef.onDestroy = () => {
      overlayRef.destroy();
    };
    this.refs.push(overlayRef);
    return overlayRef;
  }
}
