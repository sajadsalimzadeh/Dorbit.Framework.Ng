import {Component, ComponentRef, HostListener, OnInit, TemplateRef} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Positions} from "../../types";

export interface DialogOptions {
  template: TemplateRef<any>;

  width?: string;
  minWidth?: string;
  maxWidth?: string;

  position?: Positions;
  mask?: boolean;
  maskClosable?: boolean;
  movable?: boolean;

  openDuration?: number;
  closeDuration?: number;

  title?: string;

  closable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
}

export interface DialogContext {
  close?: () => void;
}

const minimizeSpaces: DialogComponent[] = [];

@Component({
  selector: 'dev-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent extends BaseComponent implements OnInit, DialogOptions, DialogContext {
  componentRef!: ComponentRef<DialogComponent>;

  template!: TemplateRef<any>;

  width?: string;
  minWidth?: string;
  maxWidth?: string;

  position: Positions = 'middle-center';
  mask: boolean = true;
  maskClosable: boolean = false;
  movable: boolean = false;

  openDuration: number = 300;
  closeDuration: number = 300;

  closable: boolean = true;
  maximizable: boolean = false;
  minimizable: boolean = false;

  title: string = '';

  isMaximize: boolean = false;
  isMinimize: boolean = false;
  isClosing: boolean = false;

  dialogStyles: any = {};

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    if(this.maskClosable) {
      this.close();
    }
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.removeMinimizeSpace();
  }

  removeMinimizeSpace() {
    const minimizeIndex = minimizeSpaces.indexOf(this);
    if (minimizeIndex > -1) {
      minimizeSpaces.splice(minimizeIndex, 1);
      minimizeSpaces.forEach(x => x.render());
    }
  }

  onDialogClick(e: MouseEvent) {
    e.stopPropagation();
  }

  override render() {
    super.render();
    this.dialogStyles = {};

    this.dialogStyles['width'] = this.width;
    this.dialogStyles['min-width'] = this.minWidth;
    this.dialogStyles['max-width'] = this.maxWidth;

    this.classes['mask'] = this.mask;
    this.classes['movable'] = this.movable;
    this.classes['minimize'] = this.isMinimize;
    this.classes['closing'] = this.isClosing;
    if (this.isMinimize) {
      const minimizeIndex = minimizeSpaces.indexOf(this);
      if (minimizeIndex > -1) {
        if (this.direction == 'ltr') {
          this.dialogStyles['left'] = ((minimizeIndex % 5) * 20) + '%';
        } else {
          this.dialogStyles['right'] = ((minimizeIndex % 5) + 20) + '%';
        }
        this.dialogStyles['transform'] = `translateY(${Math.floor(minimizeIndex / 5) * -100}%)`;
      }
    } else {
      this.classes['maximize'] = this.isMaximize;
    }

    this.classes[this.position] = true;

    this.dialogStyles['animation-duration'] = (this.openDuration + 50) + 'ms';
    this.dialogStyles['transition-duration'] = (this.closeDuration + 50) + 'ms';
  }

  close() {
    if (this.isMinimize) {
      this.componentRef.destroy()
    } else {
      this.isClosing = true;
      setTimeout(() => this.componentRef.destroy(), this.closeDuration);
      this.render();
    }
  }

  maximize() {
    this.isMaximize = !this.isMaximize;
    this.render();
  }

  minimize() {
    this.isMinimize = !this.isMinimize;
    if (this.isMinimize) {
      minimizeSpaces.push(this);
    } else {
      this.removeMinimizeSpace();
    }
    this.render();
  }
}
