import {ComponentRef, Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {DomService} from "../../services/dom.service";
import {OverlayComponent, OverlayOptions} from "./overlay.component";

export interface OverlayRef {
  autoClose: boolean;
  componentRef: ComponentRef<OverlayComponent>;
  destroy: () => void;
  onDestroy: Subject<void>;
}

@Injectable({providedIn: 'root'})
export class OverlayService {
  refs: OverlayRef[] = [];
  defaultOptions: OverlayOptions = {}

  constructor(private domService: DomService) {
    window.addEventListener('touchend', e => {
      this.refs.forEach(x => x.destroy());
    });
    window.addEventListener('click', e => {
      this.refs.forEach(x => x.destroy());
    });
  }

  create(options = this.defaultOptions) {
    this.refs.filter(x => x.autoClose).forEach(x => x.destroy());

    const componentRef = this.domService.createByComponent(OverlayComponent);
    const component = componentRef.instance;
    component.elementRef.nativeElement.addEventListener('click', e => {
      e.stopPropagation();
    });
    component.elementRef.nativeElement.addEventListener('touchend', e => {
      e.stopPropagation();
    });

    if (!options.ref) options.ref = document.body;
    Object.assign(component, options);
    const overlayRef = {
      autoClose: !!options.autoClose,
      componentRef: componentRef,
      destroy: () => {
        componentRef.destroy();
        overlayRef.onDestroy.next();
        this.refs.splice(this.refs.indexOf(overlayRef), 1);
      },
      onDestroy: new Subject<void>()
    } as OverlayRef;
    componentRef.onDestroy = () => {
      overlayRef.destroy();
    };
    this.refs.push(overlayRef);
    setTimeout(() => {
      component.overlayRef = overlayRef;
    }, 500)
    return overlayRef;
  }
}
