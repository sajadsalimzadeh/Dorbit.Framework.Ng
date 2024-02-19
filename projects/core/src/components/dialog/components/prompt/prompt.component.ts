import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogService, DialogRef} from "../../services/dialog.service";
import {DialogOptions} from "../dialog/dialog.component";
import {PromptOptions} from "../../models";
import {LoadingService} from "../../../../services";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'd-prompt',
  templateUrl: 'prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit, PromptOptions, DialogRef {
  onClose = new EventEmitter<void>();
  onResult = new EventEmitter<boolean>();
  control = new FormControl();
  message: string = '';
  dialog?: DialogRef;
  options?: DialogOptions;
  value?: string;

  @ViewChild('promptTpl') set template(value: TemplateRef<any>) {
    if (this.dialog) return;
    this.dialog = this.diagService.open({
      width: '400px',
      ...this.options,
      template: value,
    })
  }

  constructor(
    private diagService: DialogService,
    protected loadingService: LoadingService) {
  }

  ngOnInit(): void {
    if (this.value) this.control.setValue(this.value)
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
