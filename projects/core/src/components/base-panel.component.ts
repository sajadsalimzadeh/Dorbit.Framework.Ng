import {Directive, Injector, TemplateRef} from '@angular/core';
import {BaseComponent, ConfirmOptions, DialogComponent, DialogOptions, DialogRef, DialogService} from "@framework";
import {FormGroup} from "@angular/forms";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {FormUtil} from "../../../framework/projects/core/src/utils/form";

@Directive()
export abstract class BasePanelComponent extends BaseComponent {

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

  override ngOnInit() {
    super.ngOnInit();

    const classes = this.route.snapshot.data['classes'];
    if (classes) this.elementRef.nativeElement.classList.add(classes);
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
