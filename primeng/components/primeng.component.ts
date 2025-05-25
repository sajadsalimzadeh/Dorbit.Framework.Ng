import {ChangeDetectorRef, Directive, ElementRef, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {Confirmation, ConfirmationService, MessageService} from "primeng/api";
import {tap} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {HttpErrorResponse} from "@angular/common/http";
import {FileRepository} from '@framework';
import {AuthRepository} from '@identity';
import {Router} from '@angular/router';

@Directive()
export abstract class PrimengComponent implements OnInit, OnChanges, OnDestroy {
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

    protected get changeDetectorRef(): ChangeDetectorRef {
        return this._services['ChangeDetectorRef'] ??= this.injector.get(ChangeDetectorRef);
    }

    protected get confirmationService(): ConfirmationService {
        return this._services['ConfirmationService'] ??= this.injector.get(ConfirmationService);
    }

    constructor(protected injector: Injector) {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    success(message: string) {
        this.messageService.add({ severity: 'success', detail: this.t(message)});
    }

    info(message: string) {
        this.messageService.add({ severity: 'info', detail: this.t(message)});
    }

    warn(message: string) {
        this.messageService.add({ severity: 'warn', detail: this.t(message)});
    }

    error(message: string) {
        this.messageService.add({ severity: 'error', detail: this.t(message)});
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

    confirm(confirmation?: Confirmation) {
        return new Promise<void>((resolve, reject) => {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to proceed?',
                header: 'Confirmation',
                closable: true,
                closeOnEscape: true,
                icon: 'pi pi-exclamation-triangle',
                rejectButtonProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: 'Save',
                },
                accept: () => {
                    resolve();
                    if(confirmation?.accept) {
                        confirmation?.accept();
                    }
                },
                reject: () => {
                    reject();
                    if(confirmation?.reject) {
                        confirmation?.reject();
                    }
                },
            });
        });
    }
}
