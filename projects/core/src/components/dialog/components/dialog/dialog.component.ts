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
export class DialogComponent extends AbstractComponent implements DialogRef, DialogOptions, DialogContext {
  @Output() onClose = new EventEmitter<void>();

  componentRef!: ComponentRef<DialogComponent>;

  template?: TemplateRef<any>;
  component?: Type<any>;
  html?: string;

  width?: string;
  minWidth?: string;
  maxWidth?: string;
  maxWidthWindow?: string;

  height?: string;
  minHeight?: string;
  maxHeight?: string;
  maxHeightWindow?: string;

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

  context?: any;

  popStateListener: any;

  @HostListener('click', ['$event'])
  onPositionClick(e: MouseEvent) {
    if (this.maskClosable && (e.target as HTMLElement).querySelector('.dialog')) {
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
    if(history.state.dialog) {
      history.replaceState({dialog: true}, 'dialog');
    } else {
      history.pushState({dialog: true}, 'dialog');
    }
    window.addEventListener('popstate', this.popStateListener = (e: PopStateEvent) => this.close());
    if(this.context) this.context['dialog'] = this;
  }

  override ngOnDestroy() {
    if(history.state.dialog) history.back();
    this.removeMinimizeSpace();
    window.removeEventListener('popstate', this.popStateListener);
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

    this.dialogStyles['width'] = this.width;
    this.dialogStyles['min-width'] = this.minWidth;
    this.dialogStyles['max-width'] = this.maxWidth;

    if (this.elementRef.nativeElement.parentNode) {
      const parentHeight = (this.elementRef.nativeElement.parentNode?.parentNode as HTMLElement).clientHeight;
      const getMaxHeight = (value?: string) => {
        if (value && value.includes('%')) {
          return (+value.replace('%', '') * parentHeight / 100) + 'px';
        }
        return value;
      }

      this.dialogStyles['height'] = getMaxHeight(this.height);
      this.dialogStyles['min-height'] = getMaxHeight(this.minHeight);
      this.dialogStyles['max-height'] = `calc(${getMaxHeight(this.maxHeight ?? '100%')} - 1.6rem)`;
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

    this.setClass('mask', this.mask);
    this.setClass('movable', this.movable);
    this.setClass('minimize', this.isMinimize);
    this.setClass('closing', this.isClosing);
    if (this.isMinimize) {
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
      this.setClass('maximize', this.isMaximize);
    }

    this.setClass(this.position, true);

    this.dialogStyles['animation-duration'] = (this.openDuration + 50) + 'ms';
    this.dialogStyles['transition-duration'] = (this.closeDuration + 50) + 'ms';
  }

  close() {
    if (this.isMinimize) {
      this.componentRef.destroy();
      this.onClose.emit();
    } else {
      this.isClosing = true;
      setTimeout(() => {
        this.componentRef.destroy();
        this.onClose.emit();
      }, this.closeDuration);
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
