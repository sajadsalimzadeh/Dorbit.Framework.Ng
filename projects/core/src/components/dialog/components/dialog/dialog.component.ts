import {ChangeDetectorRef, Component, ComponentRef, EventEmitter, HostListener, Injector, Output, TemplateRef, Type} from '@angular/core';
import {Positions} from "../../../../types";
import {AbstractComponent} from "../../../abstract.component";
import {DialogRef} from "../../services/dialog.service";

export interface DialogOptions {
  container?: string;
  template?: TemplateRef<any>;
  component?: Type<any>;
  html?: string;

  width?: string;
  minWidth?: string;
  maxWidth?: string;

  height?: string;
  minHeight?: string;
  maxHeight?: string;

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

  isMaximize?: boolean;
  isMinimize?: boolean;

  context?: any;

  ngClass?: any;
}

export interface DialogContext {
  close?: () => void;
}

const minimizeSpaces: DialogComponent[] = [];

@Component({
  selector: 'd-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent extends AbstractComponent implements DialogRef, DialogContext {
  @Output() onClose = new EventEmitter<void>();
  options!: DialogOptions;

  componentRef!: ComponentRef<DialogComponent>;
  dialogStyles: any = {};
  isClosing: boolean = false;
  maxWidthWindow?: string;
  maxHeightWindow?: string;

  get inputs() {
    return {
      ...this.options.context,
      dialog: this
    }
  }

  @HostListener('click', ['$event'])
  onPositionClick(e: MouseEvent) {
    if (this.options.maskClosable && (e.target as HTMLElement).querySelector('.dialog')) {
      this.close();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onWindowKeyDown(e: KeyboardEvent) {
    if (e.key == 'Escape') {
      this.close();
    }
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.adjustSize();
  }

  constructor(injector: Injector, private changeDetectorRef: ChangeDetectorRef) {
    super(injector)
  }

  override ngOnInit() {
    super.ngOnInit();


    this.options.position ??= 'middle-center';
    this.options.mask ??= true;
    this.options.maskClosable ??= false;
    this.options.movable ??= false;

    this.options.openDuration ??= 300;
    this.options.closeDuration ??= 300;

    this.options.closable ??= true;
    this.options.maximizable ??= false;
    this.options.minimizable ??= false;

    this.options.title ??= '';

    this.options.isMaximize ??= false;
    this.options.isMinimize ??= false;

    document.body.classList.add('dialog-opened');
  }

  override ngOnDestroy() {
    this.removeMinimizeSpace();

    if (document.getElementsByName('d-dialog').length == 0) {
      document.body.classList.remove('dialog-opened');
    }
  }

  private removeMinimizeSpace() {
    const minimizeIndex = minimizeSpaces.indexOf(this);
    if (minimizeIndex > -1) {
      minimizeSpaces.splice(minimizeIndex, 1);
      minimizeSpaces.forEach(x => x.render());
    }
  }

  private adjustSize() {

    this.dialogStyles = {};

    this.dialogStyles['width'] = this.options.width;
    this.dialogStyles['min-width'] = this.options.minWidth;
    this.dialogStyles['max-width'] = this.options.maxWidth;

    if (this.elementRef.nativeElement.parentNode) {
      const parentHeight = (this.elementRef.nativeElement.parentNode?.parentNode as HTMLElement).clientHeight;
      const getMaxHeight = (value?: string) => {
        if (value && value.includes('%')) {
          return (+value.replace('%', '') * parentHeight / 100) + 'px';
        }
        return value;
      }

      this.dialogStyles['height'] = getMaxHeight(this.options.height);
      this.dialogStyles['min-height'] = getMaxHeight(this.options.minHeight);
      this.dialogStyles['max-height'] = `calc(${getMaxHeight(this.options.maxHeight ?? '100%')} - 1.6rem)`;
    }
    this.changeDetectorRef.detectChanges();
  }

  override ngAfterViewInit() {
    this.maxWidthWindow = `calc(${this.elementRef.nativeElement.offsetWidth}px - 1.6rem)`;
    this.maxHeightWindow = `calc(${this.elementRef.nativeElement.offsetHeight}px - 1.6rem)`;

    this.render();
  }

  override render() {
    super.render();
    this.adjustSize();

    this.setClass('mask', this.options.mask);
    this.setClass('movable', this.options.movable);
    this.setClass('minimize', this.options.isMinimize);
    this.setClass('closing', this.isClosing);
    if (this.options.isMinimize) {
      const minimizeIndex = minimizeSpaces.indexOf(this);
      if (minimizeIndex > -1) {
        if (this.dir == 'ltr') {
          this.dialogStyles['left'] = ((minimizeIndex % 5) * 20) + '%';
        } else {
          this.dialogStyles['right'] = ((minimizeIndex % 5) + 20) + '%';
        }
        this.dialogStyles['transform'] = `translateY(${Math.floor(minimizeIndex / 5) * -100}%)`;
      }
    } else {
      this.setClass('maximize', this.options.isMaximize);
    }

    this.setClass(this.options.position ?? 'middle-center', true);

    this.dialogStyles['animation-duration'] = ((this.options.openDuration ?? 300) + 50) + 'ms';
    this.dialogStyles['transition-duration'] = ((this.options.closeDuration ?? 300) + 50) + 'ms';
  }

  close() {
    if (this.options.isMinimize) {
      this.componentRef.destroy();
      this.onClose.emit();
    } else {
      this.isClosing = true;
      setTimeout(() => {
        this.componentRef.destroy();
        this.onClose.emit();
      }, this.options.closeDuration);
      this.render();
    }
  }

  maximize() {
    this.options.isMaximize = !this.options.isMaximize;
    this.render();
  }

  minimize() {
    this.options.isMinimize = !this.options.isMinimize;
    if (this.options.isMinimize) {
      minimizeSpaces.push(this);
    } else {
      this.removeMinimizeSpace();
    }
    this.render();
  }
}
