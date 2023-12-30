import {
  AfterViewInit, ChangeDetectorRef,
  Directive,
  Injector,
  OnChanges, OnDestroy,
  OnInit,
} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "./message/services/message.service";
import {LoadingService} from "../services/loading.service";
import {AbstractComponent} from "./abstract.component";
import {DialogService} from "./dialog/services/dialog.service";

@Directive()
export abstract class BaseComponent extends AbstractComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  protected get route(): ActivatedRoute {
    return this.getInstance('ActivatedRoute', ActivatedRoute);
  }

  protected get router(): Router {
    return this.getInstance('Router', Router);
  }

  protected get location(): Location {
    return this.getInstance('Location', Location);
  }

  protected get loadingService(): LoadingService {
    return this.getInstance('LoadingService', LoadingService);
  }

  protected get messageService(): MessageService {
    return this.getInstance('MessageService', MessageService);
  }

  protected get changeDetectorRef() {
    return this.getInstance('ChangeDetectorRef', ChangeDetectorRef);
  }

  protected get dialogService() {
    return this.getInstance('DialogService', DialogService);
  }

  constructor(injector: Injector) {
    super(injector);
  }

}
