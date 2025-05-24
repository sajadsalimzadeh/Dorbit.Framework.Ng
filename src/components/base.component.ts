import {AfterViewInit, ChangeDetectorRef, Directive, Injector, OnChanges, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "./message/services/message.service";
import {AbstractComponent} from "./abstract.component";
import {DialogService} from "./dialog/services/dialog.service";
import {DialogComponent, DialogOptions} from './dialog/components/dialog/dialog.component';
import {ConfirmOptions} from './dialog/models';
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../utils/form';

@Directive()
export abstract class BaseComponent extends AbstractComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    dialog?: DialogComponent;

    protected messages = {
        formInvalid: (form?: FormGroup) => {
            let hasCustomMessage = false;
            for (const formKey in FormUtil.getErrors(form)) {
                const translateKey = `message.form-invalid.${formKey}`;
                const translate = this.t(translateKey);
                if (translate == translateKey) continue;
                this.messageService.warn(translate);
                hasCustomMessage = true;
            }
            if (!hasCustomMessage) {
                this.messageService.warn(this.t('message.form-invalid'));
            }
        },
        success: () => this.messageService.success(this.t('message.success')),
        error: () => this.messageService.danger(this.t('message.error')),
    }

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

    override ngOnInit() {
        super.ngOnInit();

        const classes = this.route.snapshot.data['classes'];
        if (classes) this.elementRef.nativeElement.classList.add(classes);
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

    error(message: string) {
        this.messageService.danger(this.t(message));
    }

    showDialog(template: TemplateRef<any>, options?: DialogOptions): DialogComponent | undefined {
        return this.dialog = this.dialogService.open({
            template: template,
            width: '500px',
            maskClosable: true,
            position: 'top-center',
            ...options,
        })
    }

    confirm(message?: string, dialogOptions?: DialogOptions) {
        return new Promise<ConfirmOptions>((resolve, reject) => {
            const options = {
                message: message ?? this.t('message.confirm.description'),
                buttons: [
                    {
                        text: this.t('yes'), color: 'success', action: () => {
                            dialog.close();
                            resolve(options);

                        }
                    },
                    {
                        text: this.t('no'), color: 'danger', action: () => {
                            dialog.close();
                            reject();
                        }
                    },
                ]
            } as ConfirmOptions;
            const dialog = this.dialogService.confirm(options, {
                width: '500px',
                position: 'top-center',
                title: this.t('message.confirm.title'),
                ...dialogOptions,
            })
        })
    }
}
