import {Component, EventEmitter, Injector, Output, TemplateRef, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {Colors} from "../../../../types";
import {DialogService, DialogRef} from "../../services/dialog.service";
import {DialogOptions} from "../dialog/dialog.component";

export interface PromptButton {
  text: string;
  color?: Colors;
  loading?: boolean;
  action: (btn: PromptButton) => void
}

export interface PromptOptions {
  text: string;
  buttons: PromptButton[]
}

@Component({
  selector: 'd-prompt',
  templateUrl: 'prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent extends BaseComponent implements PromptOptions, DialogRef {
  @Output() onClose = new EventEmitter<void>();

  text!: string;
  loading?:boolean;
  container?: string;
  dialog?: DialogRef;
  options?: DialogOptions;
  buttons: PromptButton[] = [];

  @ViewChild('promptTpl') set template(value: TemplateRef<any>) {
    if(this.dialog) return;
    this.dialog = this.diagService.open({
      width: '400px',
      ...this.options,
      template: value,
    })
  }

  constructor(injector: Injector, private diagService: DialogService) {
    super(injector);
  }

  close() {
    this.dialog?.close();
  }
}
