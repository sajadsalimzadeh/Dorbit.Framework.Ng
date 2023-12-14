import {Component, EventEmitter, Injector, Output, TemplateRef, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {Colors} from "../../../../types";
import {DialogService, DialogRef} from "../../services/dialog.service";
import {DialogOptions} from "../dialog/dialog.component";

export interface ConfirmButton {
  text: string;
  color?: Colors;
  loading?: boolean;
  action: (btn: ConfirmButton) => void
}

export interface ConfirmOptions {
  text: string;
  buttons: ConfirmButton[]
}

@Component({
  selector: 'd-prompt',
  templateUrl: 'prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent extends BaseComponent implements ConfirmOptions, DialogRef {
  @Output() onClose = new EventEmitter<void>();

  text!: string;
  loading?:boolean;
  container?: string;
  dialog?: DialogRef;
  options?: DialogOptions;
  buttons: ConfirmButton[] = [];

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
