import {ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, TemplateRef, Type, ViewContainerRef,} from "@angular/core";


@Injectable({providedIn: 'root'})
export class DomService {
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  createByTemplate(template: TemplateRef<any>, viewContainerRef: ViewContainerRef, element?: Element) {
    const embeddedViewRef = viewContainerRef.createEmbeddedView(template);
    embeddedViewRef.detectChanges();
    const domElem = embeddedViewRef.rootNodes[0] as HTMLElement;
    (element ?? document.body).appendChild(domElem);
    return embeddedViewRef;
  }

  createByComponent<T>(component: Type<T>, element?: Element) {
    const componentRef = this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    (element ?? document.body).appendChild(domElem);
    return componentRef;
  }
}
