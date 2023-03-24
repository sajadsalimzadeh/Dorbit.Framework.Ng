import {
  Directive, ElementRef,
  HostListener,
  Input,
  NgModule,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {OverlayRef, OverlayService} from "../../components/overlay/overlay.service";
import {CommonModule} from "@angular/common";
import {OverlayAlignments} from "../../components/overlay/overlay.component";
import {Colors} from "../../types";

@Directive({
  selector: '[devTooltip]'
})
export class TooltipDirective {
  @Input('devTooltip') text!: string;
  @Input('devTooltipAlignment') alignment: OverlayAlignments = 'bottom-center';
  @Input('devTooltipColor') color: Colors = 'gray-4';

  @ViewChild('defaultTemplate') defaultTemplate!: TemplateRef<any>

  @HostListener('mouseenter', ['$event'])
  onEnter(e: MouseEvent) {
    this.show();
  }

  @HostListener('mouseleave', ['$event'])
  onLeave(e: MouseEvent) {
    this.hide();
  }

  private overlayRef?: OverlayRef;

  constructor(private elementRef: ElementRef, private overrideService: OverlayService) {
  }

  show() {
    if (this.overlayRef) return;
    const classes: any = {};
    classes['d-tooltip-overlay'] = true;
    classes[this.alignment] = true
    classes[this.color] = true

    this.overlayRef = this.overrideService.create({
      text: this.text,
      ngClasses: classes,
      color: this.color,
      alignment: this.alignment,
      targetElement: this.elementRef.nativeElement,
    });
    this.overlayRef.onDestroy.subscribe(() => {
      this.overlayRef = undefined;
    });
  }

  hide() {
    this.overlayRef?.destroy();
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TooltipDirective
  ],
  exports: [
    TooltipDirective
  ]
})
export class TooltipModule {
}

