import {Component, Injector, Input, TemplateRef, ViewChild,} from '@angular/core';
import {AbstractControl, createControlValueAccessor} from "../abstract-control.directive";
import {OverlayRef, OverlayService} from "../../overlay/overlay.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    selector: 'd-password',
    templateUrl: 'password.component.html',
    styleUrls: ['../control.scss', './password.component.scss'],
    providers: [createControlValueAccessor(PasswordComponent)]
})
export class PasswordComponent extends AbstractControl<string> {

    @Input() meter: boolean = false;
    @Input() visible: boolean = false;

    @ViewChild('meterTpl') meterTpl!: TemplateRef<any>;

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
                ref: this.elementRef.nativeElement
            })
            this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
        }
    }
}
