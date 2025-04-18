import {Component, ElementRef, EventEmitter, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DialogService, DialogRef} from "../../services/dialog.service";
import {DialogOptions} from "../dialog/dialog.component";
import {PromptOptions} from "../../models";
import {LoadingService} from "../../../../services";
import {ButtonComponent} from "../../../button/button.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonComponent, TranslateModule],
    selector: 'd-prompt',
    templateUrl: 'prompt.component.html',
    styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent implements PromptOptions, DialogRef {
  onClose = new EventEmitter<void>();
  onResult = new EventEmitter<boolean>();
  title: string = '';
  message: string = '';
  options!: DialogOptions;
  dialog?: DialogRef;
  value?: string;

  @ViewChild('promptTpl') set template(value: TemplateRef<any>) {
    if (this.dialog) return;
    this.dialog = this.diagService.open({
      width: '400px',
      title: this.title,
      ...this.options,
      template: value,
    });

    setTimeout(() => {
      const textareaEl = this.elementRef.nativeElement.querySelector('textarea');
      textareaEl?.focus();
    }, 1000)
  }

  constructor(
    private elementRef: ElementRef,
    private diagService: DialogService,
    protected loadingService: LoadingService) {
  }

  ok() {
    this.onResult.emit(true);
  }

  cancel() {
    this.onResult.emit(false);
    this.close();
  }

  close() {
    this.dialog?.close();
  }
}
