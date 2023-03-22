import {Component, HostListener, OnInit, TemplateRef} from "@angular/core";
import {OverlayRef} from "./overlay.service";
import {Colors} from "../../types";
import {BaseComponent} from "../base.component";

export type OverlayAlignments =
  'top-start' | 'top-center' | 'top-end' |
  'bottom-start' | 'bottom-center' | 'bottom-end' |
  'start-top' | 'start-center' | 'start-bottom' |
  'end-top' | 'end-center' | 'end-bottom';

export interface OverlayOptions {
  targetElement?: HTMLElement;
  template?: TemplateRef<any>;
  text?: string;
  html?: string;
  ngClasses?: any;
  color?: Colors;
  alignment?: OverlayAlignments;
}


@Component({
  selector: 'dev-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent extends BaseComponent implements OnInit, OverlayOptions {
  overlayRef!: OverlayRef;
  targetElement?: HTMLElement;
  template?: TemplateRef<any>;
  text?: string;
  html?: string;
  alignment?: OverlayAlignments;

  verticalThreshold = 300;
  horizontalThreshold = 300;

  animation: string = 'fade';

  overlayClasses: any = {};

  @HostListener('window:click', ['$event'])
  onWindowClick() {
    if (this.overlayRef) {
      this.overlayRef.destroy();
    }
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    e.stopPropagation();
  }

  override render() {
    super.render();
    if (!this.targetElement) return;

    const rect = this.targetElement.getBoundingClientRect();
    const topOfScreen = window.innerHeight + window.scrollY;
    const horizontalOfScreen = window.innerWidth + window.scrollX;

    const width = rect.width;
    const height = rect.height;
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;
    const right = rect.right + window.scrollX;

    const dir = getComputedStyle(document.body).direction;

    let alignment = this.alignment ?? 'bottom-start';

    if (
      (dir == 'ltr' && horizontalOfScreen - this.horizontalThreshold < left) ||
      (dir == 'rtl' && horizontalOfScreen - this.horizontalThreshold < right)
    ) {
      if (alignment == 'top-start') alignment = 'top-end';
      if (alignment == 'bottom-start') alignment = 'bottom-end';
      if (alignment == 'end-top') alignment = 'start-top';
      if (alignment == 'end-bottom') alignment = 'start-bottom';
    } else if (
      (dir == 'ltr' && this.horizontalThreshold > left) ||
      (dir == 'rtl' && this.horizontalThreshold > right)
    ) {
      if (alignment == 'top-end') alignment = 'top-start';
      if (alignment == 'bottom-end') alignment = 'bottom-start';
      if (alignment == 'start-top') alignment = 'end-top';
      if (alignment == 'start-bottom') alignment = 'end-bottom';
    }

    if (topOfScreen - this.verticalThreshold < top) {
      if (alignment == 'bottom-start') alignment = 'top-start';
      if (alignment == 'bottom-end') alignment = 'top-end';
      if (alignment == 'start-top') alignment = 'start-bottom';
      if (alignment == 'end-top') alignment = 'end-bottom';
    }


    this.styles.width = +'px';
    this.styles.left = left + 'px';

    if (alignment.startsWith('top') || alignment.startsWith('bottom')) {
      this.styles.width = width + 'px';
      if (dir == 'ltr') {
        this.styles.left = left + 'px';
      } else {
        this.styles.left = right + 'px';
      }

      if (alignment.startsWith('top')) {
        this.styles.top = top + 'px';
      } else {
        this.styles.top = top + height + 'px';
      }
    }

    if (alignment.startsWith('start') || alignment.startsWith('end')) {
      this.styles.top = top + 'px';
      this.styles.height = height + 'px';

      if (dir == 'ltr' && alignment.startsWith('start')) {
        this.styles.left = left + 'px';
      } else if (dir == 'ltr' && alignment.startsWith('end')) {
        this.styles.left = left + width + 'px';
      } else if (dir == 'rtl' && alignment.startsWith('start')) {
        this.styles.right = right + 'px';
      } else if (dir == 'rtl' && alignment.startsWith('end')) {
        this.styles.right = right + width + 'px';
      }
    }
    this.overlayClasses = {};
    this.overlayClasses[alignment] = true;
    this.overlayClasses[alignment.split('-')[0]] = true;
    this.overlayClasses['direction-' + dir] = true;
    this.overlayClasses[this.animation] = !!this.animation;
  }
}
