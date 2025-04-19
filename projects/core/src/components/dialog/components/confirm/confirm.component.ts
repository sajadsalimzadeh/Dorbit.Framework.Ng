import {Component, EventEmitter, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DialogService, DialogRef} from "../../services/dialog.service";
import {DialogOptions} from "../dialog/dialog.component";
import {ConfirmButton, ConfirmOptions} from "../../models";
import {LoadingService} from "../../../../services";
import {ButtonComponent} from "../../../button/button.component";

@Component({
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    selector: 'd-confirm',
    templateUrl: 'confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements ConfirmOptions, DialogRef {
  onClose = new EventEmitter<void>();

  message!: string;
  options!: DialogOptions;

  dialog?: DialogRef;
  loading?: boolean;
  buttons: ConfirmButton[] = [];

  @ViewChild('confirmTpl') set template(value: TemplateRef<any>) {
    if(this.dialog) return;
    this.dialog = this.diagService.open({
      width: '400px',
      ...this.options,
      template: value,
    })
  }

  constructor(private diagService: DialogService, protected loadingService: LoadingService) {
  }

  close() {
    this.dialog?.close();
  }
}
