import { ChangeDetectorRef, Directive, ElementRef, Injector, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Location } from "@angular/common";
import { Subscription, tap } from "rxjs";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { TranslateService } from "@ngx-translate/core";
import { FileRepository } from '@framework/repositories/file.repository';
import { FormUtil } from '@framework/utils/form';
import { HttpErrorResponse } from '@angular/common/http';

@Directive()
export abstract class PrimengComponent<T = any> implements OnInit, OnChanges, OnDestroy {
    protected subscription = new Subscription();
    protected selectedItem?: T;
    protected dialogs: { [key: string]: boolean } = {};
    protected loadings: { [key: string]: boolean } = {};
    protected servicesCache: any = {};

    constructor(protected injector: Injector) {

    }

    protected get messageService(): MessageService {
        return this.servicesCache['MessageService'] ??= this.injector.get(MessageService);
    }

    protected get fileRepository(): FileRepository {
        return this.servicesCache['FileRepository'] ??= this.injector.get(FileRepository);
    }

    protected get translateService(): TranslateService {
        return this.servicesCache['TranslateService'] ??= this.injector.get(TranslateService);
    }

    protected get router(): Router {
        return this.servicesCache['Router'] ??= this.injector.get(Router);
    }

    protected get elementRef(): ElementRef<HTMLElement> {
        return this.servicesCache['ElementRef'] ??= this.injector.get(ElementRef);
    }

    protected get changeDetectorRef(): ChangeDetectorRef {
        return this.servicesCache['ChangeDetectorRef'] ??= this.injector.get(ChangeDetectorRef);
    }

    protected get confirmationService(): ConfirmationService {
        return this.servicesCache['ConfirmationService'] ??= this.injector.get(ConfirmationService);
    }

    protected get location(): Location {
        return this.servicesCache['Location'] ??= this.injector.get(Location);
    }

    protected get route(): ActivatedRoute {
        return this.servicesCache['ActivatedRoute'] ??= this.injector.get(ActivatedRoute);
    }

    protected get ngZone(): NgZone {
        return this.servicesCache['NgZone'] ??= this.injector.get(NgZone);
    }

    protected tapLoading<T>(key: string) {
        this.loadings[key] = true;
        return tap<T>({
            error: () => {
                this.loadings[key] = false;
            },
            complete: () => {
                this.loadings[key] = false;
            }
        });
    }

    protected tapMessage<T>(showSuccess: boolean = true, showError: boolean = false) {
        return tap<T>({
            next: res => {
                if(showSuccess) {
                    this.messageService.add({
                        severity: 'success',
                        detail: this.t('message.operation-success')
                    })
                }
            },
            error: err => {
                if(showError) {
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

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showDialog(name: string, ...items: any[]): void {
        let item = items.length > 0 ? items[0] : null;
        if (items.length > 1) {
            items.forEach(x => {
                item = { ...item, ...x };
            });
        }
        this.selectedItem = item;
        this.dialogs[name] = true;
    }

    hideDialog(name: string): void {
        this.dialogs[name] = false;
    }

    info(message: string = 'message.info', params: any = {}) {
        this.messageService.add({
            severity: 'info',
            detail: this.t(message, params)
        });
    }

    success(message: string = 'message.success', params: any = {}) {
        this.messageService.add({
            severity: 'success',
            detail: this.t(message, params)
        });
    }

    warn(message: string = 'message.warn', params: any = {}) {
        this.messageService.add({
            severity: 'warn',
            detail: this.t(message, params)
        });
    }

    error(message: string = 'message.error', params: any = {}) {
        this.messageService.add({
            severity: 'error',
            detail: this.t(message, params)
        });
    }

    t(text: string, params: any = {}): any {
        return this.translateService.instant(text, params);
    }

    getFileUrl(name: string, download: boolean = false): string {
        return this.fileRepository.getUrl(name) + (download ? '/Download' : '');
    }

    validateForm(form: FormGroup) {
        let hasCustomMessage = false;
        for (const formKey in FormUtil.getErrors(form)) {
            const translateKey = `message.form-invalid.${formKey}`;
            const translate = this.t(translateKey);
            if (translate == translateKey) continue;
            this.warn(translate);
            hasCustomMessage = true;
        }
        if (!hasCustomMessage) {
            this.warn(this.t('message.form-invalid'));
        }
    }


    confirm(confirmation?: Confirmation) {
        return new Promise<void>((resolve, reject) => {
            this.confirmationService.confirm({
                header: this.t('confirmation.header'),
                message: this.t('confirmation.message'),
                closable: true,
                closeOnEscape: true,
                icon: 'far fa-exclamation-triangle',
                rejectButtonProps: {
                    label: confirmation?.rejectLabel ?? this.t('confirmation.reject'),
                    severity: 'secondary',
                },
                acceptButtonProps: {
                    label: confirmation?.acceptLabel ?? this.t('confirmation.accept'),
                    severity: 'danger',
                },
                ...confirmation,

                accept: () => {
                    resolve();
                    if (confirmation?.accept) {
                        confirmation?.accept();
                    }
                },
                reject: () => {
                    reject();
                    if (confirmation?.reject) {
                        confirmation?.reject();
                    }
                },
            });
        })
    }

    inputSelect(e: Event) {
        let input = e.target as HTMLInputElement;
        if (input.tagName != 'INPUT') input = input.querySelector('input') as HTMLInputElement;
        if (input) {
            input.select();
        }
    }
}
