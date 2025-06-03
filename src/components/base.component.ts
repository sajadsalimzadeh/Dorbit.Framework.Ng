import {AfterViewInit, ChangeDetectorRef, Directive, Injector, OnChanges, OnDestroy, OnInit, TemplateRef, Type} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "./message/services/message.service";
import {AbstractComponent} from "./abstract.component";
import {DialogService} from "./dialog/services/dialog.service";
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../utils/form';
import {DialogComponent, DialogOptions} from './dialog/components/dialog/dialog.component';
import {ConfirmOptions} from './dialog/models';

@Directive()
export abstract class BaseComponent extends AbstractComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    dialog?: DialogComponent;
    dialogs: { [key: string]: DialogComponent } = {}

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

    info(message: string = 'message.info') {
        this.messageService.info(this.t(message));
    }

    success(message: string = 'message.success') {
        this.messageService.success(this.t(message));
    }

    warn(message: string = 'message.warn') {
        this.messageService.warn(this.t(message));
    }

    error(message: string = 'message.error') {
        this.messageService.error(this.t(message));
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

    showDialog(name: string, template: TemplateRef<any>, options?: DialogOptions): DialogComponent {
        return this.dialogs[name] = this.dialogService.open({
            template: template,
            width: '500px',
            maskClosable: true,
            position: 'top-center',
            ...options,
        })
    }

    showDialogByComponent(component: Type<any>, context: any, options?: DialogOptions) {
        return this.dialogService.open({
            ...options,
            context: context,
            component: component
        })
    }

    hideDialog(name: string) {
        const dialog = this.dialogs[name];
        if (!dialog) return;
        dialog.close();
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
