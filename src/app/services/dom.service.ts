import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type,
  ViewContainerRef
} from "@angular/core";


@Injectable({providedIn: 'root'})
export class DomService {
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  create<T>(component: Type<T>) {
    const componentRef = this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    return componentRef;
  }
}
