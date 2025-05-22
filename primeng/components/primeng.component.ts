import {Directive, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {MessageService} from "primeng/api";
import {tap} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {HttpErrorResponse} from "@angular/common/http";
import {FileRepository} from '@framework';
import {AuthRepository} from '@identity';
import {Router} from '@angular/router';

@Directive()
export abstract class SharedComponent implements OnInit, OnDestroy {
    private _services: any = {};

    protected subscription = new Subscription();
    protected selectedItem: any;
    protected dialogs: { [key: string]: boolean } = {};

    protected get messageService(): MessageService {
        return this._services['MessageService'] ??= this.injector.get(MessageService);
    }

    protected get fileRepository(): FileRepository {
        return this._services['FileRepository'] ??= this.injector.get(FileRepository);
    }

    protected get translateService(): TranslateService {
        return this._services['TranslateService'] ??= this.injector.get(TranslateService);
    }

    protected get authRepository(): AuthRepository {
        return this._services['AuthRepository'] ??= this.injector.get(AuthRepository);
    }

    protected get router(): Router {
        return this._services['Router'] ??= this.injector.get(Router);
    }

    protected get elementRef(): ElementRef {
        return this._services['ElementRef'] ??= this.injector.get(ElementRef);
    }

    constructor(protected injector: Injector) {

    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showDialog(name: string, item?: any): void {
        this.selectedItem = item;
        this.dialogs[name] = true;
    }

    hideDialog(name: string): void {
        this.dialogs[name] = false;
    }

    tapMessage(showSuccess: boolean = true, showError: boolean = true) {
        return tap({
            next: res => {
                if (showSuccess) {
                    this.messageService.add({
                        severity: 'success',
                        detail: this.t('message.operation-success')
                    })
                }
            },
            error: err => {
                if (showError) {
                    if (err instanceof HttpErrorResponse) {
                        this.messageService.add({
                            severity: 'error',
                            detail: this.t(`message.${err.error.message}`)
                        })
                    }
                }
            }
        })
    }

    t(text: string): any {
        return this.translateService.instant(text);
    }

    getFileUrl(name: string): string {
        return this.fileRepository.getUrl(name);
    }
}
