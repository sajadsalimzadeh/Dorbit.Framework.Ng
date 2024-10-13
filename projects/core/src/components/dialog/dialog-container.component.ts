import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {DialogService} from "./services/dialog.service";

export * from './models'

@Component({
  selector: 'd-dialog-container',
  templateUrl: 'dialog-container.component.html',
  styleUrls: ['./dialog-container.component.scss']
})
export class DialogContainerComponent implements OnInit, OnDestroy {
  @Input() name?: string;

  constructor(public elementRef: ElementRef, private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.dialogService.containers.push(this);
  }

  ngOnDestroy() {
    this.dialogService.containers.splice(this.dialogService.containers.indexOf(this), 1);
  }
}
