import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    Injector,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {Subscription} from "rxjs";
import {Confirmation, ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {FileRepository, FormUtil} from '@framework';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';

@Directive()
export abstract class PrimengComponent implements OnInit, OnChanges, OnDestroy {
    protected subscription = new Subscription();
    protected selectedItem: any;
    protected dialogs: { [key: string]: boolean } = {};
    private _services: any = {};

    constructor(protected injector: Injector) {

    }

    protected get messageService(): MessageService {
        return this._services['MessageService'] ??= this.injector.get(MessageService);
    }

    protected get fileRepository(): FileRepository {
        return this._services['FileRepository'] ??= this.injector.get(FileRepository);
    }

    protected get translateService(): TranslateService {
        return this._services['TranslateService'] ??= this.injector.get(TranslateService);
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

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
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

    info(message: string = 'message.info') {
        this.messageService.add({
            severity: 'info',
            detail: this.t(message)
        });
    }

    success(message: string = 'message.success') {
        this.messageService.add({
            severity: 'success',
            detail: this.t(message)
        });
    }

    warn(message: string = 'message.warn') {
        this.messageService.add({
            severity: 'warn',
            detail: this.t(message)
        });
    }

    error(message: string = 'message.error') {
        this.messageService.add({
            severity: 'error',
            detail: this.t(message)
        });
    }

    t(text: string): any {
        return this.translateService.instant(text);
    }

    getFileUrl(name: string): string {
        return this.fileRepository.getUrl(name);
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
                message: 'Are you sure that you want to proceed?',
                header: 'Confirmation',
                closable: true,
                closeOnEscape: true,
                rejectButtonProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: `Yes, I'm sure`,
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
}
