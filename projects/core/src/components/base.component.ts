import {AfterViewInit, ChangeDetectorRef, Directive, Injector, OnChanges, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "./message/services/message.service";
import {AbstractComponent} from "./abstract.component";
import {DialogService} from "./dialog/services/dialog.service";

@Directive()
export abstract class BaseComponent extends AbstractComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    constructor(injector: Injector) {
        super(injector);
    }

    protected get messageService(): MessageService {
        return this.getInstance('MessageService', MessageService);
    }

    protected get route(): ActivatedRoute {
        return this.getInstance('ActivatedRoute', ActivatedRoute);
    }

    protected get router(): Router {
        return this.getInstance('Router', Router);
    }

    protected get location(): Location {
        return this.getInstance('Location', Location);
    }

    protected get changeDetectorRef() {
        return this.getInstance('ChangeDetectorRef', ChangeDetectorRef);
    }

    protected get dialogService() {
        return this.getInstance('DialogService', DialogService);
    }

    success(message: string) {
        this.messageService.success(this.t(message));
    }

    info(message: string) {
        this.messageService.info(this.t(message));
    }

    warn(message: string) {
        this.messageService.warn(this.t(message));
    }

    danger(message: string) {
        this.messageService.danger(this.t(message));
    }
}
