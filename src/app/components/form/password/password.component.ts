import {
  Component, Injector, Input, TemplateRef, ViewChild,
} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {OverlayRef, OverlayService} from "../../overlay/overlay.service";

export interface MaskItem {
  placeholder: string;
  pattern?: RegExp;
}

@Component({
  selector: 'dev-password',
  templateUrl: 'password.component.html',
  styleUrls: ['./password.component.scss', '../control.scss'],
  providers: [createControlValueAccessor(PasswordComponent)]
})
export class PasswordComponent extends AbstractFormControl<string> {

  @Input() meter: boolean = false;
  @Input() visible: boolean = false;

  @ViewChild('meterTpl') meterTpl!:TemplateRef<any>;

  show: boolean = false;
  overlayRef?: OverlayRef;

  constructor(injector: Injector, private overlayService: OverlayService) {
    super(injector);
  }

  override onFocus(e: FocusEvent) {
    e.preventDefault();
    this.openMeter();
    super.onFocus(e);
  }

  openMeter() {
    if (this.meterTpl && this.elementRef.nativeElement && !this.overlayRef) {
      this.overlayRef = this.overlayService.create({
        template: this.meterTpl,
        targetElement: this.elementRef.nativeElement
      })
      this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
    }
  }
}
