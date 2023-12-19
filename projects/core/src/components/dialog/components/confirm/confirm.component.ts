import {Component, EventEmitter, Injector, Output, TemplateRef, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {DialogService, DialogRef} from "../../services/dialog.service";
import {DialogOptions} from "../dialog/dialog.component";
import {ConfirmButton, ConfirmOptions} from "../../models";

@Component({
  selector: 'd-confirm',
  templateUrl: 'confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent extends BaseComponent implements ConfirmOptions, DialogRef {
  @Output() onClose = new EventEmitter<void>();

  text!: string;
  loading?:boolean;
  container?: string;
  dialog?: DialogRef;
  options?: DialogOptions;
  buttons: ConfirmButton[] = [];

  @ViewChild('confirmTpl') set template(value: TemplateRef<any>) {
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
