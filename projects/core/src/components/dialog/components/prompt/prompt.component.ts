import {Component, ElementRef, EventEmitter, TemplateRef, ViewChild} from '@angular/core';
import {DialogService, DialogRef} from "../../services/dialog.service";
import {DialogOptions} from "../dialog/dialog.component";
import {PromptOptions} from "../../models";
import {LoadingService} from "../../../../services";

@Component({
  selector: 'd-prompt',
  templateUrl: 'prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements PromptOptions, DialogRef {
  onClose = new EventEmitter<void>();
  onResult = new EventEmitter<boolean>();
  title: string = '';
  message: string = '';
  dialog?: DialogRef;
  options?: DialogOptions;
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
